const crypto = require('crypto');
const moment = require('moment');
const uuid = require('uuid');

const errcode = require('../../../errors').code;

module.exports = (req, res, next) => {
  if (!req.is('json')) {
    return next({status: 400, code: errcode.ERROR_INVALID_CONTENT_TYPE});
  }

  if (!req.body) {
    return next({status: 400, code: errcode.ERROR_INVALID_BODY_FORMAT});
  }

  const email = req.body.email;
  const plainTextPassword = req.body.password;
  const name = req.body.name;
  
  if (!email || !plainTextPassword || !name) {
    return next({status: 400, code: errcode.ERROR_MISSING_PARAMETER});
  }

  if (typeof email !== 'string' || typeof plainTextPassword !== 'string' || typeof name !== 'string') {
    return next({status: 400, code: errcode.ERROR_INVALID_PARAMETER_TYPE});
  }

  if (plainTextPassword.length < 8) {
    return next({status: 400, code: errcode.ERROR_PASSWORD_INVALID});
  }

  // Check password security
  let hasCapital = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;
  let letterCount = 0;
  
  for (let i = 0; i < plainTextPassword.length; ++i) {
    const chr = plainTextPassword.charCodeAt(i);
    if (
        (chr > 31 && chr < 48) ||
        (chr > 57 && chr < 65) || 
        (chr > 90 && chr < 97) ||
        (chr > 122 && chr < 127)
    ) {
      hasSymbol = true;
      ++letterCount;
    }

    if (chr > 47 && chr < 58) {
      hasNumber = true;
      ++letterCount;
    }

    if (chr > 64 && chr < 91) {
      hasCapital = true;
      ++letterCount;
    }

    if (chr > 96 && chr < 123) {
      hasLower = true;
      ++letterCount;
    }
  }

  if (letterCount !== plainTextPassword.length) {
    return next({status: 400, code: errcode.ERROR_PASSWORD_INVALID});
  }

  if (!hasCapital || !hasLower || !hasNumber || !hasSymbol) {
    return next({status: 400, code: errcode.ERROR_PASSWORD_INVALID});
  }

  res.status(201);
  res.end();
};

