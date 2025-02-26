const Area = require('../models/areaModel');

exports.getDebug = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Accessed Areas',
  });
  next();
};

exports.getAllAreas = async (req, res) => {
  try {
    const queryObject = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((el) => delete queryObject[el]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    let query = Area.find(JSON.parse(queryString));

    // if (req.query.owners) {
    //   const ownersArray = Array.isArray(req.query.owners)
    //     ? req.query.owners
    //     : [req.query.owners];
    //   query = query.find({ owners: { $in: ownersArray } });
    // }

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
      const numAreas = await Area.countDocuments();
      if (skip >= numAreas) throw new Error('This Page Does Not Exist!');
    }

    const areas = await query;

    res.status(200).json({
      status: 'success',
      results: areas.length,
      data: {
        areas,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getSingleArea = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id)
      .populate('office')
      .populate({
        path: 'owners',
        select: '-password',
      });
    res.status(200).json({
      status: 'success',
      data: {
        area,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createArea = async (req, res) => {
  try {
    const newArea = await Area.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        area: newArea,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      status: 'success',
      data: {
        area,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteArea = async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
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
