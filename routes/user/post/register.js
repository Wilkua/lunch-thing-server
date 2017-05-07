const crypto = require('crypto');
const moment = require('moment');
const uuid = require('uuid');

const errcode = require('../../../errors').code;

module.exports = (req, res, next) => {
  if (!req.is('json')) {
    return next({status: 400, code: errcode.ERROR_INVALID_CONTENT_TYPE});
  }

  let bodyJson = null;
  try {
    bodyJson = JSON.parse(req.body);
  } catch (e) {
    bodyJson = null;
  }
  
  if (bodyJson === null) {
    return next({status: 400, code: errcode.ERROR_INVALID_BODY_FORMAT});
  }

  const email = bodyJson.email;
  const plainTextPassword = bodyJson.password;
  const username = bodyJson.username;
  
  if (!email || !plainTextPassword || !username) {
    return next({status: 400, code: errcode.ERROR_MISSING_PARAMETER});
  }

  if (typeof email !== 'string' || typeof plainTextPassword !== 'string' || typeof username !== 'string') {
    return next({status: 400, code: errcode.ERROR_INVALID_PARAMETER_TYPE});
  }
};

