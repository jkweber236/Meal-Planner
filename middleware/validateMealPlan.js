const validator = require('../helpers/validate');
const { check, validationResult } = require('express-validator');

const saveMealPlan = (req, res, next) => {
  const validationRule = {
    monRecipeID: 'string',
    tuesRecipeID: 'string',
    wedRecipeID: 'string',
    thursRecipeID: 'string',
    friRecipeID: 'string',
    satRecipeID: 'string',
    sunRecipeID: 'string'
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
  check('id').isMongoId().withMessage('Invalid ID format'),
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

module.exports = {
  saveMealPlan,
  validateID
};
