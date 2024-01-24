import "./App.css";
import Reminder from "./Reminder";
import AddReminderForm from "./AddReminderForm";
import { useState, useEffect, useCallback } from "react";
import reminderService from "../services/reminderService";

// max delay in ms permitted in setTimeout or setInterval
const MAX_DELAY = 2 ** 31 - 1;

const App = () => {
  const [reminders, setReminders] = useState([]);
  const [formShown, setFormShown] = useState(false);

  const hideForm = () => setFormShown(false);

  const handleAddReminder = async (newReminder) => {
    const id = await reminderService.addReminder(newReminder);
    setReminders([...reminders, { ...newReminder, id }]);
  };

  const handleMarkComplete = async ({ id: completeId }) => {
    await reminderService.markComplete(completeId);
    setReminders(
      reminders.map((reminder) =>
        reminder.id === completeId ? { ...reminder, complete: true } : reminder
      )
    );
  };

  const handleArrival = ({ id: arrivedId, text }) => {
    alert(text);
    setReminders((reminders) =>
      reminders.map((reminder) => {
        return reminder.id === arrivedId
          ? { ...reminder, arrived: true }
          : reminder;
      })
    );
  };

  const startUpcomingTimers = useCallback(() => {
    const updatedReminders = [];
    let startedTimer = false;
    reminders.forEach((reminder) => {
      const millisecondDifference = reminder.dueDate.valueOf() - Date.now();
      if (
        !reminder.assignedTimer &&
        !reminder.arrived &&
        millisecondDifference <= MAX_DELAY
      ) {
        setTimeout(() => handleArrival(reminder), millisecondDifference);
        updatedReminders.push({ ...reminder, assignedTimer: true });
        startedTimer = true;
      } else {
        updatedReminders.push(reminder);
      }
    });
    if (startedTimer) {
      setReminders(updatedReminders);
    }
  }, [reminders]);

  useEffect(() => {
    (async () => {
      const reminderData = await reminderService.getAllReminders();
      setReminders(
        reminderData.map((reminder) => ({
          ...reminder,
          assignedTimer: false,
          arrived: reminder.dueDate.valueOf() < Date.now(),
        }))
      );
    })();
  }, []);

  /* Because setTimeout has an upper limit of about 25 days, to allow for reminders further
   than that in the future I use setInterval to create a repeating process that checks which
   reminders are within 25 days and creates timers for them */
  useEffect(() => {
    startUpcomingTimers();
    const intervalId = setInterval(startUpcomingTimers, MAX_DELAY);
    return () => {
      clearInterval(intervalId);
    };
  }, [startUpcomingTimers]);

  return (
    <main>
      <h1>Reminders</h1>
      {formShown ? (
        <AddReminderForm
          onAddReminder={handleAddReminder}
          hideForm={hideForm}
        />
      ) : null}
      {reminders.length === 0 && !formShown ? (
        <p>No reminders yet. Would you like to add one?</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <Reminder
              key={reminder.id}
              reminder={reminder}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </ul>
      )}
      <button onClick={() => setFormShown(true)}>Add Reminder</button>
    </main>
  );
};

export default App;
