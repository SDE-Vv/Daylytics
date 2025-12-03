const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const router = express.Router();

// Helper: format date to YYYY-MM-DD
const formatDate = (d = new Date()) => d.toISOString().slice(0, 10);

// GET /api/tasks?date=YYYY-MM-DD (defaults to today)
router.get('/', auth, async (req, res) => {
  try {
    const date = req.query.date || formatDate();
    const tasks = await Task.find({ user: req.user._id, date }).sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST /api/tasks - body { title, date? }
router.post('/', auth, async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title) return res.status(400).json({ msg: 'Title required' });

    const dateKey = date ? date.slice(0, 10) : formatDate();
    const task = new Task({ user: req.user._id, title, date: dateKey });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PATCH /api/tasks/:id toggle done
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    task.done = !task.done;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// DELETE /api/tasks/:id remove task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task deleted', id: req.params.id });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
