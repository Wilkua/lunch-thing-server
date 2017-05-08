/**
 * User endpoint functions
 * William Drescher
 * 1 May 2017
 */

'use strict';

const router = require('express').Router();

const getRegister = require('./get/user/register');
const postRegister = require('./post/user/register');

/**
 * GET /user/registration
 * Retrieve a user registrationt token and a captcha challenge string
 */
router.get('/register', getRegister);

/**
 * POST /user/register
 * Register a user with the system
 */
router.post('/register', postRegister);

module.exports = router;

