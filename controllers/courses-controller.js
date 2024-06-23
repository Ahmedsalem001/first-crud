const { validationResult } = require("express-validator");
const Course = require("../models/course.model")
const asyncWrapper = require('../middlewares/asyncWraper');
const AppError = require("../utils/appError");
const [SUCCESS, FAIL, ERROR] = ["SUCCESS", "FAIL", "ERROR"];

const getCourses = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit || 3;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
    return res.json({ status: SUCCESS, data: courses });
  });

const getCourse = asyncWrapper(
  async (req, res, next) => {
    const course = await Course.findById(req.params.id)
    if (!course) {
      const error = AppError.create("Course not found", 404, FAIL)
      return next(error)
    }
    return res.status(200).json({ status: SUCCESS, data: course });
  })

const addCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = AppError.create(errors, 400, FAIL);
    return next(error);  }
  const newCourse = new Course(req.body);
  await newCourse.save();
  return res.status(201).json({ status: SUCCESS, data: newCourse });
})

const updateCourse = asyncWrapper(async (req, res) => {
  const id = req.params.id;
    const updateCourse = await Course.updateOne({ _id: id }, { $set: { ...req.body } })
    return res.status(200).json({ status: SUCCESS, data: updateCourse });
})

const deleteCourse = asyncWrapper(async (req, res) => {
  const data = await Course.deleteOne({ _id: req.params.id })
  res.status(200).json({ status: SUCCESS, data: null });
})

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
}