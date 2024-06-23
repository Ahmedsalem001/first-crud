const { body } = require("express-validator")

const validationSchema = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('title is required')
      .isLength(2)
      .withMessage('title must be a more than 2 characters'),
    body('price')
      .isNumeric()
      .withMessage('price must be a number')
  ]
}

module.exports = validationSchema;