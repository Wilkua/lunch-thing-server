const errcode = require('../../../errors').code;

module.exports = (req, res, next) => {
  const db = req.app.locals.db;
  if (!db) {
    return next({status: 500, code: errcode.ERROR_DATABASE});
  }

  // TODO(william): Need a better captcha system (Google?)
  const collection = db.collection('user_registrations');
  const doc = {
    created: moment().utc().format(),
    registration_token: uuid(),
    challenge: 'What is forty-two minus twenty-one?'
  };
  collection.insert(doc);

  res.status(200);
  res.header('Content-Type', 'application/json');
  res.json(doc);
};

