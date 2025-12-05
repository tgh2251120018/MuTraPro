
import React, { useEffect, useState } from "react";
import { getTasks } from "../api/taskApi";
import TaskCard from "../components/TaskCard";
import "../styles/taskboard.css";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  // Group tasks by status
  const columns = {
    "Not Started": [],
    "In Progress": [],
    "Completed": [],
  };
  tasks.forEach(t => {
    columns[t.status]?.push(t);
  });

  return (
    <div className="taskboard-container">
      <h2 className="taskboard-title">Task Board</h2>
      <div className="taskboard-columns">
        {Object.entries(columns).map(([status, list]) => (
          <div key={status} className="task-column">
            <h3>{status}</h3>
            {list.map(task => (
              <TaskCard key={task._id} task={task} onClick={() => setSelectedTask(task)} />
            ))}
          </div>
        ))}
      </div>

      {/* Modal hiển thị chi tiết task */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Chi tiết nhiệm vụ</h3>
            <div><b>Tên:</b> {selectedTask.name}</div>
            <div><b>Chuyên viên:</b> {selectedTask.assigned_to?.name || "-"}</div>
            <div><b>Vai trò:</b> {selectedTask.role}</div>
            <div><b>Deadline:</b> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : "-"}</div>
            <div><b>Tiến độ:</b> {selectedTask.status}</div>
            {selectedTask.progress_note && <div><b>Ghi chú:</b> {selectedTask.progress_note}</div>}
            {selectedTask.result_files && selectedTask.result_files.length > 0 && (
              <div>
                <b>Kết quả:</b>
                <ul>
                  {selectedTask.result_files.map((f, i) => (
                    <li key={i}><a href={`/${f}`} target="_blank" rel="noopener noreferrer">File {i+1}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <button onClick={() => setSelectedTask(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}
