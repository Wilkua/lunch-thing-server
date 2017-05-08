/* eslint-env node, mocha */

const expect = require('chai').expect;
const sinon = require('sinon');

const errcode = require('../../../errors').code;
const postRegister = require('./register');

describe('POST /user/register', () => {
  let clock;
  let collection;
  let nextObj;
  let resObj;
  let reqObj;

  beforeEach(() => {
    let time = new Date('2017-05-07T06:06:45Z');
    clock = sinon.useFakeTimers(time.getTime());

    collection = {
      find: () => ({_id: 'abcdef'}),
      insert: sinon.spy(),
      remove: sinon.spy()
    };

    nextObj = sinon.spy();

    resObj = {
      end: sinon.spy(),
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
      },
      is: () => true
    };
  });

  afterEach(() => {
    clock.restore();
  });

  it('should return a 201 when sent correct information', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Password1!'
    });
    postRegister(reqObj, resObj, nextObj);
    
    expect(resObj.status.callCount).to.equal(1, 'Status function not called');
    expect(resObj.status.firstCall.args[0]).to.equal(200);
    expect(resObj.end.callCount).to.equal(1, 'End function not called');
  });

  it('should insert a valid user in the database', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Password?1!_~'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(collection.insert.callCount).to.equal(1, 'Insert function not called');
    const collectionInserArgs = collection.insert.firstCall.args[0];
    expect(collectionInsertArgs).to.be.an('object');
    expect(collectionInsertArgs.email).to.equal('test@test.com');
    expect(collectionInsertArgs.name).to.equal('Test User');
    expect(collectionInsertArgs.password).to.be.a('string').with.lengthOf(48);
    expect(collectionInserArgs.last_login).to.equal(null);
  });

  it("should return an error when the 'Content-Type' is not JSON", () => {
    reqObj.is = () => false;
    reqObj.body = '';
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1);
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_INVALID_CONTENT_TYPE,
      status: 400
    });
  });

  it('should return an error when an invalid body object is sent', () => {
    reqObj.body = '';
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1);
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_INVALID_BODY_FORMAT,
      status: 400
    });
  });

  it('should return an error when email field is missing', () => {
    reqObj.body = JSON.stringify({
      name: 'Test User',
      password: 'Password1!'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_MISSING_PARAMETER,
      status: 400
    });
  });

  it('should return an error when name field is missing', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      password: 'Password1!'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_MISSING_PARAMETER,
      status: 400
    });
  });

  it('should return an error when password field is missing', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_MISSING_PARAMETER,
      status: 400
    });
  });

  it('should return an error if email is not a string', () => {
    reqObj.body = JSON.stringify({
      email: 8,
      name: 'Test User',
      password: 'Password1!'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_INVALID_PARAMETER_TYPE,
      status: 400
    });
  });

  it('should return an error if name is not a string', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 8,
      password: 'Password1!'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_INVALID_PARAMETER_TYPE,
      status: 400
    });
  });

  it('should return an error if password is not a string', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 8
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_INVALID_PARAMETER_TYPE,
      status: 400
    });
  });

  it('should return an error if password length is too short', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Pssw!1'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });

  it('should return an error if password does not contain a capital letter', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'password!1'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });

  it('should return an error if password does not contain a lowercase letter', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'PASSWORD!1'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });

  it('should return an error if password does not contain a number', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Password!#'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });

  it('should return an error if password does not contain a special symbol', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Password15'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });

  it('should return an error if password contains non-ascii characters', () => {
    reqObj.body = JSON.stringify({
      email: 'test@test.com',
      name: 'Test User',
      password: 'Password1!\n'
    });
    postRegister(reqObj, resObj, nextObj);

    expect(nextObj.callCount).to.equal(1, 'next() function not called');
    expect(nextObj.firstCall.args[0]).to.deep.equal({
      code: errcode.ERROR_PASSWORD_INVALID,
      status: 400
    });
  });
});

