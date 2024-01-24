const AddReminderForm = ({ onAddReminder, hideForm }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const dueDate = new Date(`${form.date.value}T${form.time.value}`);
    if (dueDate.getTime() < Date.now()) {
      alert("Cannot create a reminder for a time that has passed.");
    } else {
      onAddReminder({ text: form.text.value, dueDate, complete: false });
      hideForm();
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Date
        <input name="date" type="date" required></input>
      </label>
      <label>
        Time
        <input name="time" type="time" required></input>
      </label>
      <label>
        Text
        <input name="text" type="text" required></input>
      </label>
      <button>Add</button>
      <button onClick={hideForm}>Cancel</button>
    </form>
  );
};

export default AddReminderForm;
