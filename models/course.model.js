const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2
  },
  price: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Course', courseSchema);