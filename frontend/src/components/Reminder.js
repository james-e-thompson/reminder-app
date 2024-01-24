const CompleteButton = ({ reminder, onMarkComplete }) => {
  return (
    <button
      className="complete-button"
      onClick={() => onMarkComplete(reminder)}
    >
      Complete
    </button>
  );
};

const Reminder = ({ reminder, onMarkComplete }) => {
  const { complete, arrived, text, dueDate } = reminder;
  const reminderStyle = complete ? { textDecoration: "line-through" } : {};
  return (
    <li className="reminder">
      <p style={reminderStyle}>
        {text} | {dueDate.toDateString()}{" "}
        {dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      {arrived && !complete ? (
        <CompleteButton reminder={reminder} onMarkComplete={onMarkComplete} />
      ) : null}
    </li>
  );
};

export default Reminder;
