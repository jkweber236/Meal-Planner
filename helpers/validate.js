const Validator = require('validatorjs');
const validator = (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);
  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

// Register a custom rule for MM/DD/YYYY date format
Validator.register(
  'date_format',
  (value) => {
    // Regular expression for MM/DD/YYYY format
    return (
      /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(value) &&
      !isNaN(new Date(value).getTime())
    );
  },
  'The :attribute must be a valid date in MM/DD/YYYY format.'
);

module.exports = validator;
