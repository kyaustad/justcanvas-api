const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    geometry: {
      type: {
        type: String,
        required: true,
        enum: ['Polygon'],
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
    owners: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      required: false,
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Office',
      required: true,
    },
  },
  { collection: 'areas' },
);

areaSchema.index({ coordinates: '2dsphere' });

const Area = mongoose.model('Area', areaSchema);

module.exports = Area;
