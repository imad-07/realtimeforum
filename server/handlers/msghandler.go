package handler

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"

	"forum/server/data"
	"forum/server/helpers"
	"forum/server/service"
	"forum/server/shareddata"
)

type Msghandler struct {
	Msgservice *service.Wservice
}
type MessageResponse struct {
	Messages []shareddata.ChatMessage `json:"messages"`
}
func NewMsghandler(db *sql.DB) *Msghandler {
	Wsdata := data.WsData{
		Db: db,
	}
	Wservice := service.Wservice{
		Wsdata: Wsdata,
	}
	Msghandler := &Msghandler{
		Msgservice: &Wservice,
	}
	return Msghandler
}

func (Msg *Msghandler) Maghandler(w http.ResponseWriter, r *http.Request) {
	user, err := r.Cookie(shareddata.SessionName)
	if err != nil {
		fmt.Println("Error retrieving user cookie:", err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	username, userid := service.GetUser(Msg.Msgservice.Wsdata.Db, user.Value)
	if userid != 0 {
		query := r.URL.Query()
		// Extract the "user_id"
		userID := query.Get("user_id")
		if userID == "" || !Msg.Msgservice.Wsdata.Checkuser(userID) {
			http.Error(w, "user_id is invalid", http.StatusBadRequest)
			return
		}
		// Extract the "offset"
		offsetStr := query.Get("offset")
		offset := 0 // default value
		if offsetStr != "" {
			var err error
			offset, err = strconv.Atoi(offsetStr)
			if err != nil {
				http.Error(w, "Invalid offset value", http.StatusBadRequest)
				return
			}
		}
		Msgs, err := Msg.Msgservice.Wsdata.Getconv(username, userID, offset*10)
		if err != nil {
			http.Error(w, "error in extrtacting conv", http.StatusInternalServerError)
			return
		}
		RES := MessageResponse{
			Messages: Msgs,
		}
		helpers.WriteJson(w, http.StatusOK,RES)
	} else {
		fmt.Println("Attempt to fetch from invalid user")
	}
}
