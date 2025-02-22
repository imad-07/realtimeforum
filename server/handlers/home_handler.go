package handler

import (
	"forum/server/helpers"
	"html/template"
	"log"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		//ErrorHandler(w, http.StatusMethodNotAllowed, "Method Not Allowed", "Maybe GET Method Will Work!")
		helpers.WriteJson(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	ServeHomePage(w, r)
}

// Helper
func ServeHomePage(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		//ErrorHandler(w, http.StatusNotFound, "Page Not Found", "Page You Are Looking For Doesn't Exist")
		helpers.WriteJson(w, http.StatusNotFound, "Page Not Found")
		return
	}
	t, err := template.ParseFiles("../ui/templates/index.html")
	if err != nil {
		//ErrorHandler(w, http.StatusInternalServerError, "inernal Server Error", "Error While Parsing index.html")
		helpers.WriteJson(w, http.StatusInternalServerError, "Internal Server Error")
		log.Println("Unexpected error", err)
		return
	}
	t.Execute(w, nil)
}
