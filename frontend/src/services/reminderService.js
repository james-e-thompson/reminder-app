const API_URL = "/api";

const getAllReminders = async () => {
  const response = await fetch(`${API_URL}/reminders`);
  const responseJSON = await response.json();
  return responseJSON.map((reminder) => ({
    id: reminder.Id,
    text: reminder.Text,
    dueDate: new Date(reminder.DueDate),
    complete: reminder.Complete,
  }));
};

const addReminder = async (newReminder) => {
  const response = await fetch(`${API_URL}/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newReminder),
  });
  const id = await response.json();
  return id;
};

const markComplete = async (id) => {
  await fetch(`${API_URL}/reminders/${id}/completion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: "true",
  });
};

const reminderService = { getAllReminders, addReminder, markComplete };
export default reminderService;
