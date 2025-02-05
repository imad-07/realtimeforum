package handler

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"

	"forum/server/service"
	"forum/server/shareddata"
)

type WsHandler struct {
	wsService *service.Wservice
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func (Ws *WsHandler) Wshandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, "Could not open websocket connection", http.StatusBadRequest)
		return
	}

	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		log.Fatal(err)
	}
	Ws.wsService.RegisterConnection(user.Value, conn)
}
