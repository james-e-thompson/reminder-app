package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reminder-backend/models"
	"strconv"

	"github.com/go-chi/chi/v5"
)

func GetAllReminders(w http.ResponseWriter, r *http.Request) {
	reminders := models.AllReminders()
	responseJSON, _ := json.Marshal(reminders)
	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
	return
}

func CreateReminder(w http.ResponseWriter, r *http.Request) {
	reminderDataString, _ := io.ReadAll(r.Body)
	var reminderData models.ReminderData
	err := json.Unmarshal(reminderDataString, &reminderData);
	if (err != nil) {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprint("Invalid JSON: ", err.Error())))
		return
	}
	id, err := models.AddReminder(reminderData)
	if (err != nil) {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprint("Could not add reminder: ", err.Error())))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(strconv.Itoa(id)))
}

func MarkComplete(w http.ResponseWriter, r *http.Request) {
	idString := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idString)
	if (err != nil) {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprint("Invalid id: ", err.Error())))
		return
	}
	completionString, _ := io.ReadAll(r.Body)
	var completion bool
	err = json.Unmarshal(completionString, &completion);
	if (err != nil) {
		w.WriteHeader(400)
		w.Write([]byte(fmt.Sprint("Invalid completion state: ", err.Error())))
		return
	}
	err = models.SetCompletion(id, completion)
	if (err != nil) {
		w.WriteHeader(500)
		w.Write([]byte(fmt.Sprint("Could not update completion: ", err.Error())))
		return
	}
}