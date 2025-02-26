const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'fail',
      message: 'Need both username and password',
    });
  }
  try {
    const user = await User.findOne({ username }).populate('offices');
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid Username',
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid Password',
      });
    }
    const token = createToken(user._id);

    res.cookie('jwt', token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      secure: true,
      httpOnly: true,
    });

    user.password = undefined;

    res.status(200).json({
      status: 'success',

      user: user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.checkAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Not authenticated!',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select('-password')
      .populate('offices');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User could not be found.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token',
    });
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};
