#!/bin/bash

createdb reminder_app
psql -f setup.sql postgresql://localhost/reminder_app
cd backend
go mod download
go run reminders.go