const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User endpoint tests', function() {

    before(function() {
        return runServer();
      });

    after(function() {
        return closeServer();
      });

    it('GET request should list a user', function() {
        return chai.request(app)
            .get('/user')
            .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            const expectedKeys = ['id', 'firstName', 'lastName', 'className'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
            });
    });


});