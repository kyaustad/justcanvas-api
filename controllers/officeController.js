const Office = require('../models/officeModel');

exports.getDebug = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Accessed Users',
  });
  next();
};

exports.getAllOffices = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    let query = Office.find(JSON.parse(queryString));

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
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOffices = await User.countDocuments();
      if (skip >= numOffices) throw new Error('This Page Does Not Exist!');
    }

    const offices = await query;

    res.status(200).json({
      status: 'success',
      results: offices.length,
      data: {
        offices,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSingleOffice = async (req, res) => {
  try {
    const office = await Office.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        office,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createOffice = async (req, res) => {
  try {
    const newOffice = await Office.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        office: newOffice,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateOffice = async (req, res) => {
  try {
    const office = await Office.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        office,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteOffice = async (req, res) => {
  try {
    await Office.findByIdAndDelete(req.params.id);
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
