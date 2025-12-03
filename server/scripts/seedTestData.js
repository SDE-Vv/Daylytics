/**
 * Simple seed script — creates one test user and populates tasks for yesterday
 * Run: node server/scripts/seedTestData.js (ensure .env is present or MONGO_URI set)
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const Task = require('../src/models/Task');

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/daylytics';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Make or reuse test user
  let user = await User.findOne({ email: 'test@example.com' });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password', salt);
    user = new User({ name: 'Test User', email: 'test@example.com', password: hash });
    await user.save();
  }

  // Yesterday's date key
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
  const dateKey = yesterday.toISOString().slice(0,10);

  // remove existing tasks for that date
  await Task.deleteMany({ user: user._id, date: dateKey });

  // Create 4 tasks, mark 2 done
  const tasks = [
    { user: user._id, date: dateKey, title: 'Task A', done: true },
    { user: user._id, date: dateKey, title: 'Task B', done: true },
    { user: user._id, date: dateKey, title: 'Task C', done: false },
    { user: user._id, date: dateKey, title: 'Task D', done: false },
  ];

  await Task.insertMany(tasks);

  process.exit(0);
}

run().catch(err => { process.exit(1); });
