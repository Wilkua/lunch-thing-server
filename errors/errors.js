const code = require('./codes.js');

module.exports = {
  [code.ERROR_UNKNOWN]: {
    code: code.ERROR_UNKNOWN,
    message: 'An unknown error occured',
    name: 'UNKNOWN_ERROR'
  },
  [code.ERROR_DATABASE]: {
    code: code.ERROR_DATABASE,
    message: 'An error with the database occured',
    name: 'DATABASE_ERROR'
  },
  [code.ERROR_INVALID_CONTENT_TYPE]: {
    code: code.ERROR_INVALID_CONTENT_TYPE,
    message: "Header 'Content-Type' is invalid",
    name: 'INVALID_CONTENT_TYPE'
  },
  [code.ERROR_INVALID_BODY_FORMAT]: {
    code: code.ERROR_INVALID_BODY_FORMAT,
    message: 'Message body is not formatted correctly',
    name: 'INVALID_BODY_FORMAT'
  },
  [code.ERROR_MISSING_PARAMETER]: {
    code: code.ERROR_MISSING_PARAMETER,
    message: 'API function parameter is missing',
    name: 'MISSING_PARAMETER'
  },
  [code.ERROR_INVALID_PARAMETER_TYPE]: {
    code: code.ERROR_INVALID_PARAMETER_TYPE,
    message: 'API function parameter is of an incorrect type',
    name: 'INVALID_PARAMETER_TYPE'
  },
  [code.ERROR_PASSWORD_INVALID]: {
    code: code.ERROR_PASSWORD_INVALID,
    message: 'Password does not meet security requirements',
    name: 'INVALID_PASSWORD'
  }
};

