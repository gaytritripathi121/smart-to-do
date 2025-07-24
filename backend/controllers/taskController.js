import Task from '../models/Task.js';
import List from '../models/List.js';

const validRecurrences = ['none', 'daily', 'weekly', 'monthly'];

export const getTasks = async (req, res, next) => {
  try {
    const filters = { user: req.user.id };

    if (req.query.listId) {
      filters.listId = req.query.listId;
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, dueDate, recurrence = 'none', tags = [], listId = null } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required and must be non-empty string' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: User info missing' });
    }

    const rec = validRecurrences.includes(recurrence) ? recurrence : 'none';

    if (listId) {
      const list = await List.findOne({ _id: listId, user: req.user.id });
      if (!list) return res.status(400).json({ message: 'Invalid list/project' });
    }

    const taskData = {
      user: req.user.id,
      title: title.trim(),
      recurrence: rec,
      tags: Array.isArray(tags) ? tags.map(t => t.trim()) : [],
      listId: listId || null,
    };

    if (dueDate) {
      if (isNaN(Date.parse(dueDate))) {
        return res.status(400).json({ message: 'Invalid dueDate format' });
      }
      taskData.dueDate = dueDate;
    }

    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const updatedData = req.body;
    const wasCompleted = task.completed;
    const nowCompleted = updatedData.completed === true;

    if (updatedData.listId) {
      const list = await List.findOne({ _id: updatedData.listId, user: req.user.id });
      if (!list) return res.status(400).json({ message: 'Invalid list/project for update' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!wasCompleted && nowCompleted && task.recurrence !== 'none') {
      let nextDueDate = null;
      if (task.dueDate) {
        const due = new Date(task.dueDate);
        switch (task.recurrence) {
          case 'daily':
            due.setDate(due.getDate() + 1);
            break;
          case 'weekly':
            due.setDate(due.getDate() + 7);
            break;
          case 'monthly':
            due.setMonth(due.getMonth() + 1);
            break;
        }
        nextDueDate = due;
      }

      await Task.create({
        user: task.user,
        title: task.title,
        dueDate: nextDueDate,
        recurrence: task.recurrence,
        tags: task.tags,
        listId: task.listId,
      });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getLists = async (req, res, next) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

export const createList = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'List name is required' });
    }
    const list = await List.create({ user: req.user.id, name: name.trim() });
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};
