const express = require('express');
const router = express.Router();

// ✅ POST /api/borrow
router.post('/', (req, res) => {
  const { bookId, borrowerId, charge } = req.body;

  if (!bookId || !borrowerId || !charge) {
    return res.status(400).json({ message: 'All fields (bookId, borrowerId, charge) are required' });
  }

  // TODO: Implement DB update logic here

  res.json({ message: `Book ${bookId} borrowed by user ${borrowerId} for ₹${charge}` });
});

// ✅ PUT /api/return/:bookId
router.put('/return/:bookId', (req, res) => {
  const { bookId } = req.params;

  // TODO: Update database to mark book as returned

  res.json({ message: `Book ${bookId} returned successfully` });
});

module.exports = router;
