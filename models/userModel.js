const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Must have a username!'],
      unique: true,
      trim: true,
      minLength: 5,
    },
    password: {
      type: String,
      required: [true, 'User must have password!'],
      trim: true,
      minLength: [5, 'Password must have 5 characters!'],
    },
    firstName: {
      type: String,
      required: [true, 'Must have a first name'],
      unique: false,
    },
    lastName: {
      type: String,
      required: [true, 'Must have a last name'],
      unique: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: Number,
      required: [true, 'Basic role level required'],
      default: 0,
    },
    offices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Must have at least 1 office assigned!'],
        ref: 'Office',
      },
    ],
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      trim: true,
    },
  },
  { collection: 'users' },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();

  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
