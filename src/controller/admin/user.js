const User = require('../../models/user');

exports.getAllUsers = (req, res) => {
  User.find({})
    .exec((error, users) => {
      if (error) return res.status(400).json({ error });
      if (users) {
        res.status(200).json({ users });
      }
    });
}

exports.deleteUserById = (req, res) => {
  const { userId } = req.body.payload;
  if (userId) {
    User.deleteOne({ _id: userId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: 'Params required' });
  }
}

