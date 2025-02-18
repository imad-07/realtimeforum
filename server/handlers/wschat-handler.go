package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/gorilla/websocket"

	"forum/server/data"
	"forum/server/service"
	"forum/server/shareddata"
)

type Usrhandler struct {
	Usrservice *service.Wservice
}

func Newusrhandler(db *sql.DB) *Usrhandler {
	Usrdata := data.WsData{
		Db: db,
	}
	Usrservice := service.Wservice{
		Wsdata: Usrdata,
	}
	Usrhandler := &Usrhandler{
		Usrservice: &Usrservice,
	}
	return Usrhandler
}

func NewWshandler(db *sql.DB) *WsHandler {
	Wsdata := data.WsData{
		Db: db,
	}
	Wservice := service.Wservice{
		Wsdata: Wsdata,
	}
	Wshandler := &WsHandler{
		WsService: &Wservice,
	}
	return Wshandler
}

type WsHandler struct {
	WsService *service.Wservice
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (Ws *WsHandler) Wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade failed:", err)
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}
	// Get user session cookie
	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		fmt.Println("Error retrieving user cookie:", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		conn.Close()
		return
	}

	// Register new WebSocket connection
	Ws.WsService.RegisterConnection(user.Value, conn)
	// Read messages from WebSocket connection
	for {
		var msg shareddata.ChatMessage
		err := conn.ReadJSON(&msg)
		username, id := service.GetUser(Ws.WsService.Wsdata.Db, user.Value)
		if id == 0 {
			break
		}
		msg.Sender = username
		if err != nil {
			break
		}
		if msg.Type == "message" {
			if len(strings.TrimSpace(msg.Content)) != 0{
				Ws.WsService.SendPrivateMessage(msg)
			}
		}
	}
	Ws.WsService.DeleteConnection(user.Value, conn)
}

func (Usr *Usrhandler) Getuserhandler(w http.ResponseWriter, r *http.Request) {
	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		return
	}
	username, id := service.GetUser(Usr.Usrservice.Wsdata.Db, user.Value)
	if id == 0 {
		return
	}
	usr, exists := service.Clients[username]
	if exists {
		users := Usr.Usrservice.Wsdata.Getusers(username)
		service.Mutex.Lock()
		for i := 0; i < len(users); i++ {
			if _, exists := service.Clients[users[i].Username]; exists {
				users[i].State = true
			}
		}
		service.Mutex.Unlock()
		for _, conn := range usr {
			conn.WriteJSON(users)
		}
	}
}
