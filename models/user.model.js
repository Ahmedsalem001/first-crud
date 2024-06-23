const mongoose = require('mongoose');
const { isEmail, isStrongPassword } = require('validator');
const roles = require('../utils/roles');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        isEmail,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: true,
      // validate: [isStrongPassword, 'Please provide a strong password']
    },
    token: {
      type: String,
    },
    role: {
      type: String,
      default: roles.USER,
      enum: [roles.USER, roles.ADMIN, roles.MANAGER],
    },
    avatar: {
      type: String,
      default: '/upload/user.png'
    }
  }
)
module.exports = mongoose.model('User', userSchema);