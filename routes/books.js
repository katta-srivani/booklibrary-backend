const express = require('express');
const router = express.Router();

const books = [];
let bookIdCounter = 1;

// GET all books
router.get('/', (req, res) => {
  res.json(books);
});

// GET book by ID with related details
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Placeholder logic for including author, borrower, library
  // In production, you'd join with DB or fetch from separate arrays

  res.json({
    ...book,
    author: { id: book.authorId, name: `Author ${book.authorId}` },
    borrower: { id: book.borrowerId, name: `Borrower ${book.borrowerId}` },
    library: { id: book.libraryId, name: `Library ${book.libraryId}` }
  });
});

// POST create new book
router.post('/', (req, res) => {
  const { title, authorId, borrowerId, libraryId, coverImage } = req.body;

  if (!title || !authorId || !libraryId || !coverImage) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newBook = {
    id: bookIdCounter++,
    title,
    authorId,
    borrowerId: borrowerId || null,
    libraryId,
    coverImage
  };

  books.push(newBook);
  res.status(201).json({ message: 'Book created successfully', book: newBook });
});

// PUT update a book
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const { title, authorId, borrowerId, libraryId, coverImage } = req.body;

  book.title = title || book.title;
  book.authorId = authorId || book.authorId;
  book.borrowerId = borrowerId || book.borrowerId;
  book.libraryId = libraryId || book.libraryId;
  book.coverImage = coverImage || book.coverImage;

  res.json({ message: 'Book updated successfully', book });
});

// DELETE a book
router.delete('/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books.splice(index, 1);
  res.json({ message: 'Book deleted successfully' });
});

module.exports = router;
