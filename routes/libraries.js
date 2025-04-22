const express = require('express');
const router = express.Router();

// In-memory data for simplicity (replace with DB later)
let libraries = [];
let books = [];
let users = [];

// 1. GET all libraries
router.get('/', (req, res) => {
  res.json({ libraries });
});

// 2. GET library by ID (include books + borrowers)
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const library = libraries.find(lib => lib.id === id);

  if (!library) {
    return res.status(404).json({ message: 'Library not found' });
  }

  // Include books with borrower info
  const libraryBooks = books
    .filter(book => book.libraryId === id)
    .map(book => ({
      ...book,
      borrower: users.find(u => u.id === book.borrowerId) || null
    }));

  res.json({ ...library, books: libraryBooks });
});

// 3. POST create library
router.post('/', (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  const newLibrary = {
    id: libraries.length + 1,
    name,
    location
  };

  libraries.push(newLibrary);
  res.status(201).json({ message: 'Library created', library: newLibrary });
});

// 4. PUT update library
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const library = libraries.find(lib => lib.id === id);

  if (!library) {
    return res.status(404).json({ message: 'Library not found' });
  }

  const { name, location } = req.body;
  if (name) library.name = name;
  if (location) library.location = location;

  res.json({ message: 'Library updated', library });
});

// 5. DELETE a library
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = libraries.findIndex(lib => lib.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Library not found' });
  }

  libraries.splice(index, 1);
  res.json({ message: 'Library deleted' });
});

module.exports = router;
