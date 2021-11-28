const slugify = require('slugify');
const Product = require('../models/product');
const Category = require('../models/category');
const Review = require('../models/review');
const review = require('../models/review');

exports.createProduct = (req, res) => {
  const {
    name, price, description, category, quantity, createdBy
  } = req.body;
  let productPictures = [];

  if (req.files.length > 0) {
    productPictures = req.files.map(file => {
      return { img: file.filename }
    });
  }

  const product = new Product({
    name: name,
    slug: slugify(name),
    price,
    quantity,
    description,
    productPictures,
    category,
    createdBy: req.user._id
  });

  product.save((error, product) => {
    if (error) return res.status(400).json({ error });
    if (product) {
      res.status(201).json({ product })
    }
  });
}

exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select('_id type')
    .exec((error, category) => {
      if (error) return res.status(400).json({ error });
      if (category) {
        Product.find({ category: category._id })
          .exec((error, products) => {
            if (error) return res.status(400).json({ error });
            if (category.type) {
              if (products.length > 0) {
                res.status(200).json({
                  products,
                  priceRange: {
                    under20: 20,
                    under40: 40,
                    under60: 60,
                    under80: 80,
                    under100: 100
                  },
                  productsByPrice: {
                    under20: products.filter((product) => product.price <= 20),
                    under40: products.filter((product) => product.price > 20 && product.price <= 40),
                    under60: products.filter((product) => product.price > 40 && product.price <= 60),
                    under80: products.filter((product) => product.price > 60 && product.price <= 80),
                    under100: products.filter((product) => product.price > 80 && product.price <= 100)
                  }
                });
              }
            } else {
              res.status(200).json({ products });
            }
          });
      }
    });
}

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId })
      .exec((error, product) => {
        if (error) return res.status(400).json({ error });
        if (product) {
          res.status(200).json({ product });
        }
      });
  } else {
    return res.status(400).json({ error: 'Params required' });
  }
}

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
}

exports.getProducts = async (req, res) => {
  const products = await Product.find({})
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({ products });
}

exports.getHomeProducts = (req, res) => {
  Product.find({})
    .exec((error, products) => {
      if (error) return res.status(400).json({ error });
      if (products) {
        res.status(200).json({ products });
      }
    })
}

exports.createReview = async (req, res) => {
  const newReview = new Review(req.body);
  const product = await Product.findById(req.body.id)
  newReview.owner = product;
  await newReview.save()
  product.reviews.push(newReview._id);
  await product.save()
  res.status(201).json({ review: newReview })
}

exports.getReviews = async (req, res) => {
  const product = await Product.findById(req.body.id)
    .populate('reviews')
  res.status(200).json({ reviews: product.reviews })
}

exports.getProductById = async (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId })
      .exec((error, product) => {
        if (product) {
          res.status(201).json({ product })
        }
        if (error) return res.status(404).json({ error: 'Product not found' });
      })
  }
}