'use strict';

global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
const { app, runServer, closeServer } = require('../index');
const { User } = require('../users');
const { JWT_SECRET } = require('../config');

//This will help us to make HTTP requests in ou tests
chai.use(chaiHttp);

describe('/api/user', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  beforeEach(function () { });

  afterEach(function () {
    return User.remove({});
  });

  describe('/api/users', function () {
    describe('POST', function () {
      it('Should reject users with missing username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ password })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .then(() => done())
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422)
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          });
      });
      
      it('Should reject users with missing password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username })
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          });
      });
      
      it('Should create a new user', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body.username).to.equal(username);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });
  });
});
