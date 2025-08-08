const express = require('express');
const Book = require('../models/Book');
const { verifyToken } = require('./auth');
const router = express.Router();

// Get all books with search functionality
router.get('/books', verifyToken, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } }
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books'
    });
  }
});

// Get single book by ID
router.get('/books/:id', verifyToken, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book'
    });
  }
});

// Add new book
router.post('/books', verifyToken, async (req, res) => {
  try {
    const { title, author, isbn, price, quantity, category } = req.body;

    // Validate required fields
    if (!title || !author || !isbn || !price || quantity === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: savedBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Book with this ISBN already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error adding book'
    });
  }
});

// Update book
router.put('/books/:id', verifyToken, async (req, res) => {
  try {
    const { title, author, isbn, price, quantity, category } = req.body;
    const bookId = req.params.id;

    // Validate required fields
    if (!title || !author || !isbn || !price || quantity === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if ISBN already exists for other books
    const existingBook = await Book.findOne({ isbn, _id: { $ne: bookId } });
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Another book with this ISBN already exists'
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        title,
        author,
        isbn,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    console.error('Update book error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Another book with this ISBN already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating book'
    });
  }
});

// Delete book
router.delete('/books/:id', verifyToken, async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book'
    });
  }
});

// Get dashboard stats
router.get('/dashboard/stats', verifyToken, async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const lowStockBooks = await Book.countDocuments({ quantity: { $lt: 5 } });
    const highestPriceBook = await Book.findOne().sort({ price: -1 });
    const categories = await Book.distinct('category');

    res.json({
      success: true,
      data: {
        totalBooks,
        lowStockBooks,
        highestPrice: highestPriceBook ? highestPriceBook.price : 0,
        totalCategories: categories.length
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard stats'
    });
  }
});

module.exports = router;