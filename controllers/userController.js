const User = require('../models/userModel');

exports.getDebug = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Accessed Users',
  });
  next();
};

exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || typeof req.user.role !== 'number') {
      return res.status(403).json({
        status: 'fail',
        message: 'Unauthorized access: no ROLE',
      });
    }

    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    const filterConditions = JSON.parse(queryString);

    if (req.user.role === 1) {
      filterConditions.$or = [
        { role: { $lt: req.user.role } },
        { _id: req.user._id },
      ];
    } else if (req.user.role === 2) {
      filterConditions.$or = [
        { role: { $lte: req.user.role } },
        { _id: req.user._id },
      ];
    } else if (req.user.role >= 3) {
      filterConditions.$or = [{ role: { $lte: 4 } }, { _id: req.user._id }];
    }

    let query = User.find(filterConditions)

      .populate('supervisor');

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 1000;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numUsers = await User.countDocuments();
      if (skip >= numUsers) throw new Error('This Page Does Not Exist!');
    }

    const users = await query;

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('supervisor')
      .populate('offices');

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: 'No username queried ' });
    }
    const userExists = await User.exists({ username });

    return res.status(200).json({ available: !userExists });
  } catch (err) {
    res.status(400).json({
      status: 'fail',

      message: err,
    });
  }
};
