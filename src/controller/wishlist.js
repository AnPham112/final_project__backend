const WishList = require('../models/wishlist');

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    WishList.findOneAndUpdate(condition, updateData, { upsert: true })
      .then(result => resolve())
      .catch(err => reject(err))
  });
}

exports.addItemToWishList = (req, res) => {
  WishList.findOne({ user: req.user._id })
    .exec((error, wishList) => {
      if (error) return res.status(400).json({ error });
      if (wishList) {
        //if wishlist already exists then update wishlist by quantity
        let promiseArray = [];

        req.body.wishListItems.forEach((wishListItem) => {
          const product = wishListItem.product;
          const item = wishList.wishListItems.find(wl => wl.product == product);
          let condition, update;
          if (item) {
            condition = { user: req.user._id, "wishListItems.product": product }
            update = {
              $set: {
                "wishListItems.$": wishListItem
              }
            };
          } else {
            condition = { user: req.user._id };
            update = {
              $push: {
                wishListItems: wishListItem
              }
            };
          }
          promiseArray.push(runUpdate(condition, update));
        });
        Promise.all(promiseArray)
          .then(response => res.status(201).json({ response }))
          .catch(error => res.status(400).json({ error }));
      } else {
        //if cart doesn't exist then create a new cart
        const wishList = new WishList({
          user: req.user._id,
          wishListItems: req.body.wishListItems
        });
        wishList.save((error, wishList) => {
          if (error) return res.status(400).json({ error });
          if (wishList) {
            return res.status(201).json({ wishList });
          }
        });
      }
    });
}

exports.getWishListItems = (req, res) => {
  WishList.findOne({ user: req.user._id })
    .populate("wishListItems.product", "_id name price productPictures")
    .exec((error, wishlist) => {
      if (error) return res.status(400).json({ error });
      if (wishlist) {
        let wishListItems = {};
        wishlist.wishListItems.forEach((item, index) => {
          wishListItems[item.product?._id.toString()] = {
            _id: item.product?._id.toString(),
            name: item.product?.name,
            img: item.product?.productPictures[0].img,
            price: item.product?.price
          }
        });
        res.status(200).json({ wishListItems });
      }
    });
}

exports.removeWishListItems = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    WishList.updateOne(
      { user: req.user._id },
      {
        $pull: {
          wishListItems: { product: productId }
        }
      }
    ).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  }
}