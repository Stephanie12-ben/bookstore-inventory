const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Virtual for low stock check
bookSchema.virtual('isLowStock').get(function() {
  return this.quantity < 5;
});

// Ensure virtual fields are serialized
bookSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Book', bookSchema);