import asyncHandler from 'express-async-handler';
import Task from '../models/Task.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body; // status is now expected

  const task = new Task({
    title,
    description,
    status: status || 'Pending', // Default to 'Pending' if not provided
    user: req.user._id,
  });

  const createdTask = await task.save();
  res.status(201).json(createdTask);
});

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let tasks = await Task.find({ user: req.user._id });
  // Return tasks sorted by creation date
  res.json(tasks);
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task && task.user.toString() === req.user._id.toString()) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export { createTask, getTasks, getTaskById, updateTask, deleteTask };