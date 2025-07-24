import List from '../models/List.js';
import Task from '../models/Task.js';

// Get all lists for user
export const getLists = async (req, res, next) => {
  try {
    const lists = await List.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(lists);
  } catch (error) {
    next(error);
  }
};

// Create a new list for user
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

// Delete list and associated tasks
export const deleteList = async (req, res, next) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!list) return res.status(404).json({ message: 'List not found' });

    // Delete tasks associated with this list for the user
    await Task.deleteMany({ listId: req.params.id, user: req.user.id });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
