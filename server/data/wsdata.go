package data

import (
	"database/sql"
	"fmt"
	"log"
	"time"

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
	fmt.Println(time.Now())
	defer stmt.Close()
	_, err = stmt.Exec(msg.Sender, msg.Reciver, msg.Content)
	if err != nil {
		log.Fatal(err)
	}
}

func (Ws *WsData) Getconv(Sender, Receiver string, num int) ([]shareddata.ChatMessage, error) {
	if num == 0 {
		rw := Ws.Db.QueryRow(`SELECT id FROM user_chats WHERE (sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?) ORDER BY id DESC LIMIT 1;`, Sender, Receiver, Receiver, Sender)
		err := rw.Scan(&num)
		if err != nil {
			return nil, err
		}
		num++
	}
	query := `
        SELECT sender, receiver, message, time, id
        FROM user_chats 
        WHERE id < ? AND ((sender = ? AND receiver = ?) OR (sender = ? AND receiver = ?))
        ORDER BY id DESC 
        LIMIT 10;
    `
	rows, err := Ws.Db.Query(query, num, Sender, Receiver, Receiver, Sender)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	var messages []shareddata.ChatMessage
	for rows.Next() {
		var msg shareddata.ChatMessage
		if err := rows.Scan(&msg.Sender, &msg.Reciver, &msg.Content, &msg.Timestamp, &msg.Id); err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

func (Ws *WsData) Getusers(username string) []User {
	var users []User
	query := `
    SELECT 
        user_profile.username,
        user_profile.id
    FROM user_profile
    LEFT JOIN user_chats 
        ON (LOWER(user_profile.username) = LOWER(user_chats.sender) 
            OR LOWER(user_profile.username) = LOWER(user_chats.receiver)) 
        AND (LOWER(user_chats.sender) = LOWER($1) 
             OR LOWER(user_chats.receiver) = LOWER($1))
    WHERE LOWER(user_profile.username) != LOWER($1)
    GROUP BY user_profile.id
    ORDER BY MAX(user_chats.time) DESC, LOWER(user_profile.username);
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
