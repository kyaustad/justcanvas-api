const mongoose = require('mongoose');

const officeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Must have a name!'],
      unique: true,
      trim: true,
      minLength: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
  },
  { collection: 'offices' },
);

const Office = mongoose.model('Office', officeSchema);

module.exports = Office;
