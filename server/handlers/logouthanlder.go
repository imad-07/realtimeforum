package handler

import (
	"database/sql"
	"fmt"
	"log"
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
	fmt.Println("logout")
	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		log.Fatal(err)
	}
	username, _ := service.GetUser(Lo.db, user.Value)
	delete(service.Clients, username)
	service.Notify(username)
	http.SetCookie(w, &http.Cookie{
		Name:   shareddata.SessionName,
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})
}
