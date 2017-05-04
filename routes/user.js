/**
 * User endpoint functions
 * William Drescher
 * 1 May 2017
 */

'use strict';

const router = require('express').Router();
const uuid = require('uuid');

/**
 * GET /user/registration
 * Retrieve a user registrationt token and a captcha challenge string
 */
router.get('/register', (req, res) => {
  // TODO(william): The UUID and challenge answer need to be saved to the database
  // TODO(william): for verification later.
  res.status(200);
  res.header('Content-Type', 'application/json');
  res.json({
    registration_token: uuid(),
    challenge: 'What is forty-two minus twenty-one?'
  });
});

module.exports = router;

