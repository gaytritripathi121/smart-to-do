import express from 'express';
import { getLists, createList, deleteList } from '../controllers/listController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getLists);
router.post('/', createList);
router.delete('/:id', deleteList); // <-- added DELETE route for deleting a list

export default router;
