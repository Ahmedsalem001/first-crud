const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const [SUCCESS, FAIL, ERROR] = ["SUCCESS", "FAIL", "ERROR"];

const verifyToken = async (req, res, next) => { 
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader) {
    const error = appError.create("token is required", 401, ERROR)
    return next(error)
  }
  const token = authHeader.split(' ')[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next()
  }
  catch (err) {
    const error = appError.create("Invalid token", 401, ERROR)
    return next(error)
  }
}
module.exports = verifyToken;