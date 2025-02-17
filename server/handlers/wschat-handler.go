package handler

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"

	"forum/server/data"
	"forum/server/service"
	"forum/server/shareddata"
)

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
		if id == 0{
			break
		}
		msg.Sender = username
		if err != nil {
			break
		}
		if msg.Type == "message"{
			Ws.WsService.SendPrivateMessage(msg)
		}
	}
	Ws.WsService.DeleteConnection(user.Value, conn)
}
