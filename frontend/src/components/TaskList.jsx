import React from 'react';

const recurrenceLabels = {
  none: '',
  daily: 'Daily 🔄',
  weekly: 'Weekly 🔄',
  monthly: 'Monthly 🔄',
};

const TaskList = ({ tasks, onToggleComplete, onDelete, isTaskOverdue }) => (
  <ul className="list-group">
    {tasks.length === 0 && (
      <li className="list-group-item text-center text-muted">No tasks to display</li>
    )}
    {tasks.map((task) => {
      const overdue = isTaskOverdue(task.dueDate) && !task.completed;
      return (
        <li
          key={task._id}
          className={`list-group-item d-flex justify-content-between align-items-center ${
            overdue ? 'list-group-item-danger' : ''
          }`}
        >
          <div>
            <input
              type="checkbox"
              className="form-check-input me-2"
              checked={task.completed}
              onChange={() => onToggleComplete(task._id, !task.completed)}
              id={`task-${task._id}`}
              aria-label={`Mark task "${task.title}" as ${
                task.completed ? 'incomplete' : 'complete'
              }`}
            />
            <label
              htmlFor={`task-${task._id}`}
              style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
              className="me-3"
            >
              {task.title}
            </label>
            {task.recurrence && task.recurrence !== 'none' && (
              <small
                style={{
                  color: '#f50057',
                  fontWeight: '600',
                  userSelect: 'none',
                  marginLeft: 6,
                  fontSize: '0.85rem',
                }}
                title={`Recurring: ${recurrenceLabels[task.recurrence]}`}
              >
                ({recurrenceLabels[task.recurrence]})
              </small>
            )}
            {task.dueDate && (
              <small
                className={`badge ${overdue ? 'bg-danger' : 'bg-secondary'} ms-3`}
                style={{ fontSize: '0.75rem', userSelect: 'none' }}
              >
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </small>
            )}
          </div>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onDelete(task._id)}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            Delete
          </button>
        </li>
      );
    })}
  </ul>
);

export default TaskList;
