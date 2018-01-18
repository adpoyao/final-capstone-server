const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const expect = chai.expect;

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
                const res = err.err.response;
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
    })
})

