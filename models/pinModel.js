const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema(
  {
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return (
              v.length === 2 && v.every((coord) => typeof coord === 'number')
            );
          },
          message: (props) => `${props.value} is not a valid coordinate pair!`,
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    office: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Office',
      required: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'Not Interested',
        'Pitched',
        'Not Home',
        'Sale',
        'No Knock',
        'Go Back',
      ],
      default: 'Not Home',
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
    },
    email: {
      type: String,
      trim: true,
      required: false,
    },
    address: {
      type: String,
      trim: true,
      required: false,
    },
    city: {
      type: String,
      trim: true,
      required: false,
    },
    state: {
      type: String,
      trim: true,
      required: false,
    },
    zip: {
      type: String,
      trim: true,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'pins' },
);

pinSchema.index({ coordinates: '2dsphere' });

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
