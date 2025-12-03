const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user = new User({ name: name || '', email, password: hash });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// GET /api/auth/me - return current user data
router.get('/me', auth, (req, res) => {
  if (!req.user) return res.status(404).json({ msg: 'User not found' });
  const { _id: id, email, name, createdAt } = req.user;
  res.json({ id, email, name, createdAt });
});

// PUT /api/auth/profile - update name/email
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name && !email) return res.status(400).json({ msg: 'Nothing to update' });

    if (email) {
      const existing = await User.findOne({ email, _id: { $ne: req.user._id } });
      if (existing) return res.status(400).json({ msg: 'Email already in use' });
      req.user.email = email;
    }
    if (name !== undefined) req.user.name = name;

    await req.user.save();
    res.json({ id: req.user._id, email: req.user.email, name: req.user.name });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// PUT /api/auth/password - change password
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Current and new password required' });
    }

    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    if (!req.user.password) {
      return res.status(500).json({ msg: 'User password not found' });
    }

    const match = await bcrypt.compare(currentPassword, req.user.password);
    
    if (!match) {
      return res.status(400).json({ msg: 'Current password incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    req.user.password = await bcrypt.hash(newPassword, salt);
    
    await req.user.save();
    
    res.json({ msg: 'Password updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
