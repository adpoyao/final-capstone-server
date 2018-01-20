const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../index');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Class endpoint tests', function() {

    before(function() {
        return runServer();
      });

    after(function() {
        return closeServer();
      });

    it('should GET a list a classes', function() {
        return chai.request(app)
            .get('/class')
            .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.above(0);
            const expectedKeys = ['className'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
            });
    });

describe('POST', function () {
    it('Should reject post with missing className', function () {
    return chai
        .request(app)
        .post('/class')
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
        expect(res.body.location).to.equal('className');
        });
    });
    
    it('Should create a new class', function () {
    return chai
        .request(app)
        .post('/class')
        .send({ className })
        .then(res => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body.className).to.equal(className);
        return Class.findOne({ className });
        })
    });
});



it('should PUT update a class', function() {
    const updateClass = {
        firstName: 'John',
        lastName: 'Doe',
        className: 'BIO103',
        id: '123'
    };
    return chai.request(app)
        .get('/class')
        .then(function(res) {
        updateClass.id = '123';
        return chai.request(app)
            .put(`/class/${updateClass.id}`)
            .send(updateClass)
        })
        .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateClass);
        });
});

it('should DELETE a class', function() {
    return chai.request(app)
        .get('/class')
        .then(function(res) {
        return chai.request(app)
            .delete(`/class/${res.body[0].id}`);
        })
        .then(function(res) {
        expect(res).to.have.status(204);
        });
});
});