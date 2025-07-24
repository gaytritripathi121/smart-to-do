import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TaskList from '../components/TaskList';
import FilterBar from '../components/FilterBar';
import { getTasks, addTask, updateTask, deleteTask } from '../services/taskService';
import { getLists, createList, deleteList } from '../services/listService';

const sparkleAnimation = `
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(1) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.5) rotate(180deg); }
  }
`;

const sparkleStyle = {
  display: 'inline-block',
  marginLeft: 6,
  color: 'hotpink',
  animation: 'sparkle 1.5s infinite ease-in-out',
};

const divaFont = "'Poppins', sans-serif";

const recurrenceOptions = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

// Request notification permission once per session
const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
    return;
  }
  if (Notification.permission === 'default') {
    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    } catch (err) {
      console.error('Notification permission request failed:', err);
    }
  }
};

// Show a browser notification via service worker or fallback
const showNotification = (title, body) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body,
        icon: '/icons/icon-192x192.png', // OPTIONAL: add your icon here
        vibrate: [200, 100, 200],
        tag: title,
      });
    });
  } else {
    new Notification(title, { body });
  }
};

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [activeListId, setActiveListId] = useState(null);
  const [newListName, setNewListName] = useState('');
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskRecurrence, setNewTaskRecurrence] = useState('none');
  const [newTaskTags, setNewTaskTags] = useState('');

  useEffect(() => {
    requestNotificationPermission();
    fetchLists();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [activeListId]);

  // Notify for due/overdue tasks when tasks load or update
  useEffect(() => {
    if (!tasks.length || Notification.permission !== 'granted') return;

    const now = Date.now();

    tasks.forEach(task => {
      if (task.completed) return;

      if (task.dueDate) {
        const dueTime = new Date(task.dueDate).getTime();
        // Notify immediately if overdue
        if (dueTime <= now) {
          showNotification(
            `Task "${task.title}" is overdue!`,
            `Due date was ${new Date(task.dueDate).toLocaleString()}`
          );
        } else if (dueTime - now <= 60000) {
          // Notify if due within the next 60 seconds
          showNotification(
            `Task "${task.title}" is almost due!`,
            `Due at ${new Date(task.dueDate).toLocaleTimeString()}`
          );
        }
      }
    });
  }, [tasks]);

  const fetchLists = async () => {
    try {
      const response = await getLists();
      if (Array.isArray(response.data)) {
        setLists(response.data);
        if (!activeListId && response.data.length > 0) {
          setActiveListId(response.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const params = {};
      if (activeListId) params.listId = activeListId;
      const response = await getTasks(params);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    try {
      const response = await createList({ name: newListName.trim() });
      setLists([response.data, ...lists]);
      setActiveListId(response.data._id);
      setNewListName('');
    } catch (error) {
      console.error('Error adding list:', error);
    }
  };

  const handleDeleteList = async (listId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this list? All tasks in this list will also be deleted.'
    );
    if (!confirmed) return;

    try {
      await deleteList(listId);
      const updatedLists = lists.filter((list) => list._id !== listId);
      setLists(updatedLists);

      if (activeListId === listId) {
        setActiveListId(updatedLists.length > 0 ? updatedLists[0]._id : null);
      }
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Failed to delete list. Please try again.');
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const tagsArray = newTaskTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const newTask = {
        title: newTaskTitle.trim(),
        dueDate: newTaskDueDate || undefined,
        recurrence: newTaskRecurrence,
        tags: tagsArray,
        listId: activeListId,
      };

      const response = await addTask(newTask);
      setTasks([response.data, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskRecurrence('none');
      setNewTaskTags('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === 'Completed') return task.completed;
      if (filter === 'Pending') return !task.completed;
      return true;
    })
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return (
      due < now &&
      !(
        due.getDate() === now.getDate() &&
        due.getMonth() === now.getMonth() &&
        due.getFullYear() === now.getFullYear()
      )
    );
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await updateTask(id, { completed });
      setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <>
      <style>{sparkleAnimation}</style>
      <Navbar />
      <div
        className="container p-4 rounded d-flex"
        style={{
          background: 'linear-gradient(135deg, #f8bbd0, #e1bee7)',
          fontFamily: divaFont,
          boxShadow: '0 8px 24px rgba(255, 105, 180, 0.5)',
          minHeight: '100vh',
        }}
      >
        {/* Sidebar with lists and delete button */}
        <aside
          style={{
            width: 250,
            marginRight: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 15,
            boxShadow: '0 0 15px rgba(245, 0, 87, 0.3)',
            height: 'fit-content',
          }}
        >
          <h4 style={{ color: '#880e4f', marginBottom: '0.5rem', userSelect: 'none' }}>
            Lists <span style={sparkleStyle}>✨</span>
          </h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {lists.map((list) => (
              <li
                key={list._id}
                style={{
                  padding: '8px 12px',
                  borderRadius: 12,
                  backgroundColor: activeListId === list._id ? '#fce4ec' : 'transparent',
                  color: activeListId === list._id ? '#f50057' : '#880e4f',
                  fontWeight: activeListId === list._id ? '700' : '600',
                  marginBottom: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onClick={() => setActiveListId(list._id)}
              >
                <span>{list.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleDeleteList(list._id);
                  }}
                  aria-label={`Delete list ${list.name}`}
                  title="Delete list"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f50057',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    lineHeight: 1,
                  }}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddList} style={{ marginTop: 15 }}>
            <input
              type="text"
              placeholder="New list name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 20,
                border: '2px solid #f48fb1',
                marginBottom: 6,
                boxShadow: 'inset 0 1px 5px #fce4ec',
                fontWeight: 600,
              }}
            />
            <button
              type="submit"
              className="btn btn-pink fw-bold w-100"
              style={{
                background: 'linear-gradient(45deg, #f50057, #c51162)',
                borderRadius: 30,
                padding: '8px 0',
                fontSize: '1rem',
                boxShadow: '0 0 12px #f50057',
                transition: 'transform 0.2s ease-in-out',
              }}
            >
              Add List
            </button>
          </form>
        </aside>

        {/* Main content */}
        <main style={{ flexGrow: 1 }}>
          <h1
            className="mb-4 text-center fw-bold"
            style={{
              color: '#880e4f',
              textShadow: '1px 1px 4px #e040fb, 0 0 15px #f48fb1',
              fontSize: '3rem',
              userSelect: 'none',
            }}
          >
            Tasks <span style={sparkleStyle}>✨</span> <span style={sparkleStyle}>🌸</span>
          </h1>

          <input
            type="text"
            className="form-control mb-3 shadow-sm"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: 30,
              border: '2px solid #f06292',
              fontWeight: '600',
              boxShadow: '0 0 8px #f48fb1',
              fontSize: '1.1rem',
              outline: 'none',
            }}
          />

          <form
            onSubmit={handleAddTask}
            className="mb-3 d-flex flex-wrap gap-3 align-items-center justify-content-center"
            style={{
              background: 'white',
              padding: '15px',
              borderRadius: 20,
              boxShadow: '0 4px 20px rgba(255, 64, 129, 0.3)',
            }}
          >
            <input
              type="text"
              className="form-control flex-grow-1"
              value={newTaskTitle}
              placeholder="Add new task"
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
              style={{
                borderRadius: 30,
                border: '2px solid #f48fb1',
                padding: '10px 20px',
                fontWeight: '600',
                boxShadow: 'inset 0 1px 5px #fce4ec',
                fontSize: '1rem',
              }}
            />
            <input
              type="date"
              className="form-control"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              style={{
                borderRadius: 30,
                border: '2px solid #f48fb1',
                padding: '10px 15px',
                fontWeight: '600',
                boxShadow: 'inset 0 1px 5px #fce4ec',
                fontSize: '1rem',
                maxWidth: 180,
              }}
            />
            <select
              value={newTaskRecurrence}
              onChange={(e) => setNewTaskRecurrence(e.target.value)}
              className="form-select"
              style={{
                borderRadius: 30,
                border: '2px solid #f48fb1',
                padding: '10px 15px',
                fontWeight: '600',
                boxShadow: 'inset 0 1px 5px #fce4ec',
                fontSize: '1rem',
                maxWidth: 180,
              }}
            >
              {recurrenceOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
              placeholder="Tags (comma separated)"
              className="form-control"
              style={{
                borderRadius: 30,
                border: '2px solid #f48fb1',
                padding: '10px 15px',
                fontWeight: '600',
                boxShadow: 'inset 0 1px 5px #fce4ec',
                fontSize: '1rem',
                maxWidth: 250,
              }}
            />
            <button
              type="submit"
              className="btn btn-pink fw-bold"
              style={{
                background: 'linear-gradient(45deg, #f50057, #c51162)',
                borderRadius: 30,
                padding: '10px 30px',
                fontSize: '1.1rem',
                boxShadow: '0 0 12px #f50057',
                transition: 'transform 0.2s ease-in-out',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Add
            </button>
          </form>

          <FilterBar filter={filter} setFilter={setFilter} />

          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            isTaskOverdue={isOverdue}
          />
        </main>
      </div>
    </>
  );
};

export default Home;
