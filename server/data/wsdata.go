package data

import (
	"database/sql"
	"log"
	"time"
)

type Message struct {
	Sender   string
	Receiver string
	Time     time.Time
	Text     string
}
type WsData struct {
	Db *sql.DB
}

func (Ws *WsData) Insertconv(msg Message) {
	// check user existence
	// check message validity and lentgh
	stmt, err := Ws.Db.Prepare("INSERT INTO user_chats (sender, reciever, message) VALUES (?, ?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(msg.Sender, msg.Receiver, msg.Text)
	if err != nil {
		log.Fatal(err)
	}
}

func (Ws *WsData) Getconv(Sender, Receiver string, num int) ([]Message, error) {
	// check user existence
	// check message validity and lentgh
	query := `
        SELECT sender, receiver, message 
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
	var messages []Message
	for rows.Next() {
		var msg Message
		if err := rows.Scan(&msg.Sender, &msg.Receiver, &msg.Text, &msg.Time); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}
