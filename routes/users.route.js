const express = require('express');
const multer = require('multer');
const DiskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    const uniqueName = `user-${Date.now()}.${ext}`
    cb(null, uniqueName)
  }
})
const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split('/')[0];
  if (imageType === 'image') {
    cb(null, true);
  } else {
    cb(appError.create("the file must be an image", 400), false);
  }
}
const upload = multer({ storage: DiskStorage, fileFilter });
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
  getAllUsers,
  register,
  login,
} = require("../controllers/users-controller");
const appError = require('../utils/appError');
router.route('/').get(verifyToken, getAllUsers);
router.route('/register').get(upload.single("avatar"),register);
router.route('/login').get(login);

module.exports = router;
