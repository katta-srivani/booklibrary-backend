const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv'); 
dotenv.config();

const users = []; 
// POST /register
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

// POST /login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,  // Use the secret from .env
    { expiresIn: '1h' }
  );

  res.status(200).json({
    message: 'Login successful',
    token
  });
});

// Middleware to authenticate routes
function auth(req, res, next) {
  const token = req.session.authorization?.accessToken;

  if (!token) {
    return res.status(403).json({ message: "User not logged in" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Example of using the middleware for a protected route
router.get('/protected', auth, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
