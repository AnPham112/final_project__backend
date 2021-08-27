const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  offer: { type: Number },
  productPictures: [
    { img: { type: String } }
  ],
  reviews: [
    // {
    //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //   review: String
    // }
    reviewSchema
  ],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Category',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  updatedAt: Date,
}, { timestamps: true });

mongoose.model('Review', reviewSchema);
module.exports = mongoose.model('Product', productSchema);