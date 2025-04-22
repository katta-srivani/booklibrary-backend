const express = require('express');
const router = express.Router();

// Sample data - would normally come from a database
let libraries = [
  { id: 1, name: 'City Library', inventory: [] }
];

// GET: View inventory of a specific library
router.get('/', (req, res) => {
  const library = libraries.find(lib => lib.id === req.libraryId);
  if (!library) {
    return res.status(404).json({ message: "Library not found" });
  }
  res.json(library.inventory);
});

// POST: Add a book to the inventory of a specific library
router.post('/', (req, res) => {
  const { title, author, borrowerId } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  const library = libraries.find(lib => lib.id === req.libraryId);
  if (!library) {
    return res.status(404).json({ message: "Library not found" });
  }

  const newBook = {
    id: Date.now(), // Better ID generation
    title,
    author,
    borrowerId: borrowerId || null,
    libraryId: req.libraryId // Track which library owns this book
  };

  library.inventory.push(newBook);
  res.status(201).json(newBook);
});

// DELETE: Remove a book from inventory
router.delete('/:bookId', (req, res) => {
  const library = libraries.find(lib => lib.id === req.libraryId);
  if (!library) {
    return res.status(404).json({ message: "Library not found" });
  }

  const bookIndex = library.inventory.findIndex(book => book.id === req.bookId);
  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found in inventory" });
  }

  const [deletedBook] = library.inventory.splice(bookIndex, 1);
  res.json({ 
    message: "Book removed successfully",
    deletedBook
  });
});

module.exports = router;