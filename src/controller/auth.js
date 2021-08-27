const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const shortid = require('shortid');

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
      if (user) return res.status(400).json({
        message: 'User already registered'
      });
      const { firstName, lastName, email, password } = req.body;
      const hash_password = await bcrypt.hash(password, 10);
      const _user = new User({
        firstName,
        lastName,
        email,
        hash_password,
        userName: shortid.generate(),
      });
      _user.save((error, data) => {
        if (error) {
          return res.status(400).json({ message: 'Something went wrong' });
        }

        if (user) {
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;

          return res.status(201).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName }
          });
        }
      });
    });
}

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec(async (error, user) => {
      if (error) return res.status(400).json({ error });
      if (user) {
        const isPassword = await user.authenticate(req.body.password);
        if (isPassword && user.role === 'user') {
          const token = generateJwtToken(user._id, user.role);
          const { _id, firstName, lastName, email, role, fullName } = user;
          res.status(200).json({
            token,
            user: { _id, firstName, lastName, email, role, fullName }
          });
        } else {
          return res.status(400).json({ message: 'Invalid password' });
        }
      } else {
        return res.status(400).json({ message: 'Something went wrong' });
      }
    });
}

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
}

exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.lastName = req.body.lastName || user.lastName
    user.firstName = req.body.firstName || user.firstName
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.status(201).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email
    })
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}
