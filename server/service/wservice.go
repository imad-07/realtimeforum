package service

import (
	"fmt"
	"html"
	"sync"

	"forum/server/data"
	"forum/server/shareddata"

	"github.com/gorilla/websocket"
)

type Wservice struct {
	Wsdata data.WsData
}

var (
	Clients = make(map[string][]*websocket.Conn)
	Mutex   = sync.Mutex{}
)

// Register a new WebSocket connection for a user
func (Ws *Wservice) RegisterConnection(user string, conn *websocket.Conn) {
	Ws.HandleConnection(user, conn)
	if _, exist := Clients[user]; exist {
		return
	}
	username, userid := GetUser(Ws.Wsdata.Db, user)
	if userid != 0 {
		Mutex.Lock()
		Clients[username] = append(Clients[username], conn)
		Mutex.Unlock()
		var msg shareddata.ChatMessage
		msg.Type = "signal-on"
		msg.Content = username
		Notify(username, msg)
	} else {
		fmt.Println("Attempt to register invalid user")
	}
	return
}

// Handle an incoming WebSocket connection
func (Ws *Wservice) HandleConnection(uuid string, conn *websocket.Conn) {
	username, _ := GetUser(Ws.Wsdata.Db, uuid)
	Mutex.Lock()
	users := Ws.Wsdata.Getusers(username)
	for i := 0; i < len(users); i++ {
		if _, exists := Clients[users[i].Username]; exists {
			users[i].State = true
		}
	}
	Mutex.Unlock()
	fmt.Println(users)
	conn.WriteJSON(users)
}

// Remove a WebSocket connection for a user
func (Ws *Wservice) DeleteConnection(uuid string, conn *websocket.Conn) {
	username, _ := GetUser(Ws.Wsdata.Db, uuid)
	Mutex.Lock()
	defer Mutex.Unlock()
	connections := Clients[username]
	for i := 0; i < len(connections); i++ {
		if connections[i] == conn {
			Clients[username] = append(connections[:i], connections[i+1:]...)
			break
		}
	}
	if len(Clients[username]) == 0 {
		delete(Clients, username)
	var message shareddata.ChatMessage
		message.Content = username
		message.Type = "signal-off"
		Notify(username, message)
	}
}

func Notify(username string, message shareddata.ChatMessage) {
	for userID, connections := range Clients {
		if userID == username {
			continue
		}
		for _, conn := range connections {
			err := conn.WriteJSON(message)
			if err != nil {
				fmt.Println(Clients)
				fmt.Println(username," Error sending message:", err)
			}
		}
	}
} 
func (Ws *Wservice) SendPrivateMessage(msg shareddata.ChatMessage) {
	msg.Content = html.EscapeString(msg.Content)
	msg.Sender = html.EscapeString(msg.Sender)
	msg.Reciver = html.EscapeString(msg.Reciver)
	reciver, exists := Clients[msg.Reciver]
	if exists {
		for _, conn := range reciver {
			err := conn.WriteJSON(msg)
			if err != nil {
				fmt.Println("Error sending private message:", err)
			}
		}
	}
	if Ws.Wsdata.Checkuser(msg.Reciver) {
		Ws.Wsdata.Insertconv(msg)
	}
}
