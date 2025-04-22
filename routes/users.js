const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = []; // Same in-memory store

const JWT_SECRET = 'your_super_secret_key'; // 🔒 Move to env for production

// POST /register (already added)
router.post('/register', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { id: users.length + 1, username, password, role };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// ✅ POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'Login successful',
    token
  });
});

module.exports = router;
