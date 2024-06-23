const asyncWrapper = require('../middlewares/asyncWraper');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const generateJwt = require("../utils/generateJwt");
const appError = require('../utils/appError');
const [SUCCESS, FAIL, ERROR] = ["SUCCESS", "FAIL", "ERROR"];
const getAllUsers = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit || 3;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    return res.json({ status: SUCCESS, data: users });
  });
const register = asyncWrapper(
  async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;
    const existUser = await User.findOne({ email: email });

    if (existUser) {
      const error = appError.create("this email already exists", 400, FAIL)
      return next(error)
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User(
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        role,
        avatar: req.file.filename
      }
    )
    const token = await generateJwt({ email: newUser.email, id: newUser._id, role: newUser.role });
    newUser.token = token;
    newUser.save();
    return res.status(200).json({ status: SUCCESS, data: newUser });
  });

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create("email and password are required", 400, FAIL)
    return next(error)
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 400, FAIL)
    return next(error)
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = appError.create("invalid password", 400, FAIL)
    return next(error)
  }
  if (match && user) {
    const token = await generateJwt({ email: user.email, id: user._id , role: user.role});
    return res.status(200).json({ status: SUCCESS, data: { token } })
  } else {
    const error = appError.create("something went wrong", 500, Error)
    return next(error)
  }
})

module.exports = {
  getAllUsers,
  register,
  login,
}