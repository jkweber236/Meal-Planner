const validator = require('../helpers/validate');
const { check, validationResult } = require('express-validator');

const saveRecipe = (req, res, next) => {
  const validationRule = {
    name: 'required|string',
    category: 'string',
    ingredients: 'required|array',
    instructions: 'required|array',
    prepTime: 'integer',
    cookTime: 'integer'
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const validateID = [
  check('id').optional().isMongoId().withMessage('Invalid ID format'),
  check('userid').optional().isMongoId().withMessage('Invalid user ID format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Limit get all endpoints so that attackers cannot overwhelm the system.
const limitGetAll = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  // Validate that limit is not greater than 100
  if (limit > 100) {
    return res.status(400).send({
      success: false,
      message: 'Limit cannot exceed 100'
    });
  }
  next();
};

module.exports = {
  saveRecipe,
  validateID,
  limitGetAll
};
