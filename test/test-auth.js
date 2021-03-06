global.DATABASE_URL = 'mongodb://localhost/jwt-auth-demo-test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const expect = chai.expect;
const { app, runServer, closeServer } = require('../index');
const { User } = require('../users');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

//This will help us to make HTTP requests in ou tests
chai.use(chaiHttp);

describe('Auth endpoints', function() {
    const username = 'exampleUser';
    const password = 'examplePass';
    const firstName = 'Example';
    const lastName = 'User';
    
    //In order to test, we need to start the server by calling the
    // runServer function
    before(function () {
        return runServer(); 
    })

    //After the test, we need to close the server by calling the 
    // closeServer function
    after(function () {
        return closeServer()
    })

    //Before each test, we need to create user in the databse and hash passowrd
    beforeEach(function () {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password,
                firstName,
                lastName
            })
        )
    })

    //After each test, it is neccessary to remove that user from the databse
    afterEach(function () {
        return User.remove({})
    })

    //This test will test the login end point when user provide no credentials
    describe('/api/auth/login', function () {
        it('Should reject requests with no credentials', function () {
            return chai 
                .request(app)
                .post('/api/auth/login')
                .then(() =>
                    expect.fail(null, null, 'Request should not succed')
            )
            .catch(err => {
                if (err instanceof chai.AssertionError) {
                    throw err;
                }
                const res = err.response;
                expect(res).to.have.status(400);
            })
        })
        //This test when user provide wrong username
        it('Should reject requests with incorrect usernames', function () {
            return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username: 'wrongUsername', password})
                .then(() =>
                    expect.fail(null, null, "request should not succeed")
            )
                .catch(err => {
                    if (err instanceof chai.AssertionError) {
                        throw err;
                    }
                    const res = err.response;
                    expect(res).to.have.status(401);
                })
        })
        //This test when user provide wrong password
        it('Should reject requests with incorrect passwords', function () {
            return chai
              .request(app)
              .post('/api/auth/login')
              .send({ username, password: 'wrongPassword' })
              .then(() =>
                expect.fail(null, null, 'Request should not succeed')
              )
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }
      
                const res = err.response;
                expect(res).to.have.status(401);
              });
          });

          it('Should return a valid auth token', function () {
            return chai
              .request(app)
              .post('/api/auth/login')
              .send({ username, password })
              .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                  algorithm: ['HS256']
                });
                expect(payload.user.username).to.deep.equal(username);
              });
          });
        });
      
        describe('/api/auth/refresh', function () {
          it('Should reject requests with no credentials', function () {
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .then(() =>
                expect.fail(null, null, 'Request should not succeed')
              )
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }
      
                const res = err.response;
                expect(res).to.have.status(401);
              });
          });
          it('Should reject requests with an invalid token', function () {
            const token = jwt.sign(
              {
                username,
                firstName,
                lastName
              },
              'wrongSecret',
              {
                algorithm: 'HS256',
                expiresIn: '7d'
              }
            );
      
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .set('Authorization', `Bearer ${token}`)
              .then(() =>
                expect.fail(null, null, 'Request should not succeed')
              )
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }
      
                const res = err.response;
                expect(res).to.have.status(401);
              });
          });
          it('Should reject requests with an expired token', function () {
            const token = jwt.sign(
              {
                user: {
                  username,
                  firstName,
                  lastName
                },
                exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username
              }
            );
      
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .set('authorization', `Bearer ${token}`)
              .then(() =>
                expect.fail(null, null, 'Request should not succeed')
              )
              .catch(err => {
                if (err instanceof chai.AssertionError) {
                  throw err;
                }
      
                const res = err.response;
                expect(res).to.have.status(401);
              });
          });
          it('Should return a valid auth token with a newer expiry date', function () {
            const token = jwt.sign(
              {
                user: {
                  username,
                  firstName,
                  lastName
                }
              },
              JWT_SECRET,
              {
                algorithm: 'HS256',
                subject: username,
                expiresIn: '7d'
              }
            );
            const decoded = jwt.decode(token);
      
            return chai
              .request(app)
              .post('/api/auth/refresh')
              .set('authorization', `Bearer ${token}`)
              .then(res => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                const token = res.body.authToken;
                expect(token).to.be.a('string');
                const payload = jwt.verify(token, JWT_SECRET, {
                  algorithm: ['HS256']
                });
                expect(payload.user).to.deep.equal({
                  username,
                  firstName,
                  lastName
                });
                expect(payload.exp).to.be.at.least(decoded.exp);
              });
          });
    })
})

