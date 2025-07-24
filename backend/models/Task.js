import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: false },
  recurrence: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none',
  },
  tags: [{ type: String, trim: true }], // Array of tags as strings
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', default: null }, // Optional reference to List/Project
});

export default mongoose.model('Task', taskSchema);
