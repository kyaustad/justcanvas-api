const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not Authorized, no token cookie',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid Token',
    });
  }

  // OLD
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // }
  // if (!token) {
  //   return res.status(401).json({
  //     status: 'fail',
  //     message: 'Not authorized',
  //   });
  // }
  // try {
  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = await User.findById(decoded.id).select('-password');
  //   console.log(req.user);
  //   next();
  // } catch (err) {
  //   res.status(401).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
};

module.exports = { protect };
