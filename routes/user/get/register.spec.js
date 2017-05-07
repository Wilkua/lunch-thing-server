/* eslint-env node, mocha */

const expect = require('chai').expect;
const sinon = require('sinon');

const getRegister = require('./register');

describe('GET /user/register', () => {
  let clock;

  beforeEach(() => {
    let time = new Date('2017-05-07T06:06:45Z');
    clock = sinon.useFakeTimers(time.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return the date and time when the registration token was created');

  it('should return a valid UUID registration token');

  it('should return a valid captcha challenge');

  it('should renew UUID registration when requested with existing UUID');

  it('should reject UUID renewal when UUID is not found');
});

