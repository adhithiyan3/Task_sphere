import express from 'express';
const router = express.Router();
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, createTask).get(protect, getTasks);
router
  .route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;