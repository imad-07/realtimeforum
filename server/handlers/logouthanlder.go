package handler

import (
	"database/sql"
	"net/http"

	"forum/server/service"
	"forum/server/shareddata"
)

type Lo struct {
	db *sql.DB
}

func NewLo(B *sql.DB) Lo {
	var lo Lo
	lo.db = B
	return lo
}

func (Lo *Lo) Logout(w http.ResponseWriter, r *http.Request) {
	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		http.SetCookie(w, &http.Cookie{
			Name:   shareddata.SessionName,
			Value:  "",
			Path:   "/",
			MaxAge: -1,
		})
	} else {
		username, _ := service.GetUser(Lo.db, user.Value)
		service.Mutex.Lock()
		for _,conn := range service.Clients[username]{
			conn.Close()
		}
		delete(service.Clients, username)
		var message shareddata.ChatMessage
		message.Content = username
		message.Type = "signal-off"
		service.Notify(username, message)
		http.SetCookie(w, &http.Cookie{
			Name:   shareddata.SessionName,
			Value:  "",
			Path:   "/",
			MaxAge: -1,
		})
		service.Mutex.Unlock()
	}
}
