const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

app.use(express.json());

// Session middleware
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Route Imports
const auth_routes = require('./routes/auth_users.js');
const general_routes = require('./routes/general.js');
const book_routes = require('./routes/books.js');
const borrow_routes = require('./routes/borrow.js');
const user_routes = require('./routes/users.js');
const library_routes = require('./routes/libraries.js');
const inventory_routes = require('./routes/inventory.js');

// Param middleware
app.param('libraryId', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid library ID format' });
  req.libraryId = parseInt(id); // Store parsed value for later use
  next();
});

app.param('bookId', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid book ID' });
  req.bookId = parseInt(id); // Store parsed value for later use
  next();
});

// Bind routes
app.use("/auth", auth_routes);
app.use("/", general_routes);
app.use("/api/books", book_routes);
app.use("/api/borrow", borrow_routes);
app.use("/api/libraries", library_routes);
app.use("/api/libraries/:libraryId/inventory", inventory_routes); // Fixed route mounting
app.use("/api/users", user_routes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});