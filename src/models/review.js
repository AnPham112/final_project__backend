const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  content: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);