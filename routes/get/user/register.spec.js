/* eslint-env node, mocha */

const expect = require('chai').expect;
const sinon = require('sinon');

const errcode = require('../../../errors').code;
const getRegister = require('./register');

describe('GET /user/register', () => {
  let clock;
  let collection;
  let nextObj;
  let resObj;
  let reqObj;

  beforeEach(() => {
    let time = new Date('2017-05-07T06:06:45Z');
    clock = sinon.useFakeTimers(time.getTime());

    collection = {
      insert: sinon.spy()
    };

    nextObj = sinon.spy();

    resObj = {
      json: sinon.spy(),
      status: sinon.spy(),
      type: sinon.spy()
    };

    reqObj = {
      app: {
        locals: {
          db: {
            collection: () => collection
          }
        }
      }
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return a valid captcha challenge', () => {
    getRegister(reqObj, resObj, nextObj);

    expect(resObj.json.firstCall.args[0]).to.be.an('object');
    expect(resObj.json.firstCall.args[0].challenge).to.be.a('string');
  });

  it('should return the date and time when the registration token was created', () => {
    getRegister(reqObj, resObj, nextObj);

    expect(resObj.json.firstCall.args[0]).to.be.an('object');
    expect(resObj.json.firstCall.args[0].created).to.equal('2017-05-07T06:06:45Z');
  });

  it('should return a valid UUID registration token', () => {
    getRegister(reqObj, resObj, nextObj);

    expect(resObj.json.firstCall.args[0]).to.be.an('object');
    expect(resObj.json.firstCall.args[0].registration_token).to.have.lengthOf(36);
  });

  it('should insert the registration document in the database', () => {
    getRegister(reqObj, resObj, nextObj);

    expect(collection.insert.firstCall.args[0]).to.be.an('object');
    expect(collection.insert.firstCall.args[0].challenge).to.be.a('string');
    expect(collection.insert.firstCall.args[0].created).to.equal('2017-05-07T06:06:45Z');
    expect(collection.insert.firstCall.args[0].registration_token).to.have.lengthOf(36);
  });

  it('should return an error when there is no database', () => {
    reqObj.app.locals.db = undefined;
    
    getRegister(reqObj, resObj, nextObj);

    expect(nextObj.firstCall.args[0]).to.be.an('object');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      status: 500,
      code: errcode.ERROR_DATABASE
    });
  });
});

