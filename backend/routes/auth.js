const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

const createToken = (user) => {
  const payload = {
    userId: user._id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      role: 'user',
    });

    await user.save();

    const token = createToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({ message: 'Username and role are required' });
    }

    if (role === 'admin') {
      if (!password) {
        return res.status(400).json({ message: 'Password is required for admin login' });
      }

      const user = await User.findOne({ username, role });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = createToken(user);
      return res.json({ token });
    }

    if (role === 'user') {
      if (!email) {
        return res.status(400).json({ message: 'Email is required for customer login' });
      }

      const user = await User.findOne({ username, email, role });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = createToken(user);
      return res.json({ token });
    }

    return res.status(400).json({ message: 'Invalid role' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/register-admin', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
      role: 'admin',
    });

    await user.save();

    const token = createToken(user);
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Admin registration failed' });
  }
});

module.exports = router;
