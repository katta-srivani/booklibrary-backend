// router/general.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('📚 Welcome to the Book Library API!');
});

router.get('/status', (req, res) => {
  res.json({ status: '✅ OK', uptime: process.uptime() });
});

module.exports = router;
