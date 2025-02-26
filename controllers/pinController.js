const Pin = require('../models/pinModel');

exports.getDebug = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Accessed Pins',
  });
  next();
};

exports.getAllPins = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    let query = Pin.find(JSON.parse(queryString));

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
    const limit = req.query.limit * 1 || 350;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numPins = await User.countDocuments();
      if (skip >= numPins) throw new Error('This Page Does Not Exist!');
    }

    const pins = await query;

    res.status(200).json({
      status: 'success',
      results: pins.length,
      data: {
        pins,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSinglePin = async (req, res) => {
  try {
    const pin = await Pin.findById(req.params.id)
      .populate('owner')
      .populate('office');

    res.status(200).json({
      status: 'success',
      data: {
        pin,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createPin = async (req, res) => {
  try {
    const newPin = await Pin.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        pin: newPin,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updatePin = async (req, res) => {
  try {
    const pin = await Pin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        pin,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deletePin = async (req, res) => {
  try {
    await Pin.findByIdAndDelete(req.params.id);
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
