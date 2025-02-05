package service

import (
	"fmt"
	"sync"
	"time"

	"forum/server/data"

	"github.com/gorilla/websocket"
)

type Wservice struct {
	wsdata data.WsData
}

var (
	clients = make(map[int]*websocket.Conn) // username -> WebSocket connection
	mutex   = sync.Mutex{}
)

type Message struct {
	Sender   int       `json:"sender"`
	Receiver int       `json:"receiver"`
	Time     time.Time `json:"time"`
	Text     string    `json:"text"`
}

func (Ws *Wservice) sendMessageToUser(msg Message) {
	mutex.Lock()
	receiverConn, exists := clients[msg.Receiver]
	mutex.Unlock()

	if exists {
		err := receiverConn.WriteJSON(msg)
		if err != nil {
			fmt.Println("Error sending message:", err)
		}
	} else {
		fmt.Println("User", msg.Receiver, "not connected")
	}
}

func (Ws *Wservice) RegisterConnection(user string, conn *websocket.Conn) {
	_, userid := GetUser(Ws.wsdata.Db, user)
	mutex.Lock()
	clients[userid] = conn
	mutex.Unlock()
}
