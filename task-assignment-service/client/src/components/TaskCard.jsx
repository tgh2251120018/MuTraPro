import React from "react";

export default function TaskCard({ task, onClick }) {
  return (
    <div className="task-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div><strong>{task.name}</strong></div>
      <div>Due: {task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : "-"}</div>
    </div>
  );
}
