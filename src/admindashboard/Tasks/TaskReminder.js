import React, { useEffect, useState } from "react";

const TaskReminder = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [expiringTasks, setExpiringTasks] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    checkMorningReminder(savedTasks);
  }, []);

  const checkMorningReminder = (tasks) => {
    const today = new Date().toISOString().split("T")[0];
    const expiring = tasks.filter((task) => task.dueDate === today);
    if (expiring.length > 0) {
      setExpiringTasks(expiring);
      const warningModal = new window.bootstrap.Modal(
        document.getElementById("warningModal")
      );
      warningModal.show();
    }
  };

  const addTask = () => {
    if (taskName && dueDate && dueTime) {
      const newTasks = [...tasks, { id: Date.now(), name: taskName, dueDate, dueTime }];
      setTasks(newTasks);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      setTaskName("");
      setDueDate("");
      setDueTime("");
      const addTaskModal = window.bootstrap.Modal.getInstance(
        document.getElementById("addTaskModal")
      );
      addTaskModal.hide();
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-dark text-white text-center">
          <h2>Task Reminder</h2>
        </div>
        <div className="card-body">
          <button
            className="btn btn-primary mb-3 w-100"
            data-bs-toggle="modal"
            data-bs-target="#addTaskModal"
          >
            + Add Task
          </button>
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>Task Name</th>
                  <th>Due Date</th>
                  <th>Due Time</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.name}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.dueTime}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">No tasks available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <div className="modal fade" id="addTaskModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Add Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Task Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Due Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={addTask}>Save Task</button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      <div className="modal fade" id="warningModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-warning text-dark">
              <h5 className="modal-title">Warning</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <p><strong>Warning:</strong> Some tasks are expiring today!</p>
              <ul>
                {expiringTasks.map((task) => (
                  <li key={task.id}>{task.name} - {task.dueDate}</li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReminder;
