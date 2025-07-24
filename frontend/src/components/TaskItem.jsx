import React from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <li
      className={`list-group-item d-flex justify-content-between align-items-center ${
        task.completed ? 'list-group-item-success' : ''
      }`}
    >
      <span
        style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
        onClick={() => onToggleComplete(task._id, !task.completed)}
      >
        {task.title}
      </span>
      <button className="btn btn-danger btn-sm" onClick={() => onDelete(task._id)}>
        Delete
      </button>
    </li>
  );
};

export default TaskItem;
