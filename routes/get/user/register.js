const moment = require('moment');
const uuid = require('uuid');

const errcode = require('../../../errors').code;

module.exports = (req, res, next) => {
  const db = req.app.locals.db;
  if (!db) {
    return next({status: 500, code: errcode.ERROR_DATABASE});
  }

  // TODO(william): Need a better captcha system (Google?)
  const collection = db.collection('user_registrations');
  const doc = {
    challenge: 'What is forty-two minus twenty-one?',
    created: moment().utc().format(),
    registration_token: uuid()
  };
  collection.insert(doc);

  res.status(200);
  res.type('json');
  res.json(doc);
};

