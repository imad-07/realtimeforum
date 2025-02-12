package data

import (
	"database/sql"
	"log"

	"forum/server/shareddata"
)

type WsData struct {
	Db *sql.DB
}

type User struct {
	Username string `json:"username"`
	Id       string `json:"id"`
	State    bool   `json:"state"`
}

func (Ws *WsData) Insertconv(msg shareddata.ChatMessage) {
	stmt, err := Ws.Db.Prepare("INSERT INTO user_chats (sender, receiver, message) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(msg.Sender, msg.Reciver, msg.Content)
	if err != nil {
		log.Fatal(err)
	}
}

func (Ws *WsData) Getconv(Sender, Receiver string, num int) ([]shareddata.ChatMessage, error) {
	query := `
        SELECT sender, receiver, message, time 
        FROM user_chats 
        WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?)
        ORDER BY id DESC 
        LIMIT 10 OFFSET ?;
    `
	rows, err := Ws.Db.Query(query, Sender, Receiver, Receiver, Sender, num)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var messages []shareddata.ChatMessage
	for rows.Next() {
		var msg shareddata.ChatMessage
		if err := rows.Scan(&msg.Sender, &msg.Reciver, &msg.Content, &msg.Timestamp); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

func (Ws *WsData) Getusers(username string) []User {
	var users []User
	query := `
        SELECT username, id
        FROM user_profile 
        WHERE (username != ?)
        ORDER BY username ASC;
    `
	rows, err := Ws.Db.Query(query, username)
	if err != nil {
		log.Fatal(err)
	}
	for rows.Next() {
		var user User
		if err := rows.Scan(&user.Username, &user.Id); err != nil {
			log.Fatal(err)
		} else {
			users = append(users, user)
		}
	}
	return users
}

func (Ws *WsData) Checkuser(username string) bool {
	var id int
	query := `SELECT id FROM user_profile WHERE username = ? LIMIT 1`
	err := Ws.Db.QueryRow(query, username).Scan(&id)
	if err != nil {
		return false
	}
	return true
}
