package main

import (
	"net/http"
	"reminder-backend/models"
	"reminder-backend/routes"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	models.DatabaseConnectionPool = models.NewConnection()
	defer models.DatabaseConnectionPool.Close()
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"https://*", "http://*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "OPTIONS"},
	}))
	r.Route("/api", func(r chi.Router) {
		routes.Setup(r)
	})
	r.Handle("/*", http.FileServer(http.Dir("./build")))
	http.ListenAndServe(":3000", r)
}