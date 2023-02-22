const expressValidation = require('express-validation');

const validate = (schema) => expressValidation.validate(schema);

module.exports = validate;