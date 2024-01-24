package routes

import (
	"reminder-backend/services"

	"github.com/go-chi/chi/v5"
)

func Setup(Router chi.Router) {
	Router.Get("/reminders", services.GetAllReminders)
	Router.Post("/reminders", services.CreateReminder)
	Router.Put("/reminders/{id}/completion", services.MarkComplete)
}