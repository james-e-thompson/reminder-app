package models

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ReminderData struct {
	Text string
	DueDate time.Time
	Complete bool
}

type StoredReminder struct {
	Id int
	Text string
	DueDate time.Time
	Complete bool
}

const databaseURL = "postgresql://localhost/reminder_app"

var DatabaseConnectionPool *pgxpool.Pool;

func NewConnection() *pgxpool.Pool {
	connection, _ := pgxpool.New(context.Background(), databaseURL)
	return connection;
}

func AllReminders() []StoredReminder {
	query := "select id, reminder_text, due_date, complete from reminders;"
	rows, err := DatabaseConnectionPool.Query(context.Background(), query)
	if (err != nil) {
		fmt.Println(err)
	}
	reminders := []StoredReminder{};
	for rows.Next() {
		var reminder StoredReminder;
		err = rows.Scan(&reminder.Id, &reminder.Text, &reminder.DueDate, &reminder.Complete)
		reminders = append(reminders, reminder)
	}
	return reminders
}

func AddReminder(reminder ReminderData) (id int, err error) {
	query := "insert into reminders (reminder_text, due_date, complete) values ($1, $2, $3) returning id"
	row := DatabaseConnectionPool.QueryRow(context.Background(), query, reminder.Text, reminder.DueDate, reminder.Complete)
	err = row.Scan(&id)
	return
}

func SetCompletion(id int, completionState bool) (err error) {
	query := "update reminders set complete=$1 where id=$2"
	_, err = DatabaseConnectionPool.Exec(context.Background(), query, completionState, id)
	return
}