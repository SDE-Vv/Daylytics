/**
 * Rollover script — find all users and archive tasks for given date or yesterday
 * Usage: node server/scripts/rolloverAll.js [YYYY-MM-DD]
 */
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Task = require('../src/models/Task');
const DailyArchive = require('../src/models/DailyArchive');

const formatDate = (d = new Date()) => d.toISOString().slice(0, 10);

const run = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/daylytics';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  let date = process.argv[2];
  if (!date) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    date = formatDate(yesterday);
  }

  const users = await User.find({});
  for (const u of users) {
    const tasks = await Task.find({ user: u._id, date });
    if (!tasks || tasks.length === 0) continue;

    const total = tasks.length;
    const completed = tasks.filter(t => t.done).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const archive = new DailyArchive({ user: u._id, date, total, completed, percentage });
    await archive.save();
    await Task.deleteMany({ user: u._id, date });
  }

  process.exit(0);
}

run().catch(err => { process.exit(1); });
