const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  content: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);