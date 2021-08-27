const slugify = require('slugify');
const Product = require('../models/product');
const Category = require('../models/category');

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
                    under5k: 5000,
                    under10k: 10000,
                    under15k: 15000,
                    under20k: 20000,
                    under30k: 30000
                  },
                  productsByPrice: {
                    under5k: products.filter((product) => product.price <= 5000),
                    under10k: products.filter((product) => product.price > 5000 && product.price <= 10000),
                    under15k: products.filter((product) => product.price > 10000 && product.price <= 15000),
                    under20k: products.filter((product) => product.price > 15000 && product.price <= 20000),
                    under30k: products.filter((product) => product.price > 20000 && product.price <= 30000)
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
  } else {
    res.status(400).json({ error: 'Params required' });
  }
}

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();
  res.status(200).json({ products });
}

exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400).json({ error: 'Product already reviewed' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
}