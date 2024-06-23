const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses-controller");
const validationSchema = require('../middlewares/validationSchema');
const verifyToken = require('../middlewares/verifyToken');
const roles = require('../utils/roles');
const allowedTo = require('../models/allowedTo');



router.route('/')
  .get(getCourses)
  .post(verifyToken, allowedTo(roles.ADMIN, roles.MANAGER), validationSchema(), addCourse)

router.route('/:id')
  .get(getCourse)
  .patch(verifyToken, updateCourse)
  .delete(verifyToken, allowedTo(roles.ADMIN, roles.MANAGER), deleteCourse)

module.exports = router;
