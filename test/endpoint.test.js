const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../index');

const expect = chai.expect;
const { Classes } = require('../classes/models');

chai.use(chaiHttp);

describe('Classes endpoint tests', function() {

    before(function() {
        return runServer();
      });

    after(function() {
        return closeServer();
      });


describe('GET', function () {
    it('should get a list a classes', function() {
        return chai
            .request(app)
            .get('/classes')
            .then(function(res) {
                // console.log(res)
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
    it('should get a single student class', function() {
    //   let student = new Classes ({
    //       className: 'BIO101',
    // })
        return chai
            .request(app)
            .get('/classes/' )
            // .send(student)
            .then(function(res) {
                console.log('res.body single get', res.body)
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
});


describe('POST', function () {
    it('Should reject post with missing className', function () {
        return chai
            .request(app)
            .post('/classes')
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
        className = 'className'
            .request(app)
            .post('/classes')
            .send({ className })
            .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            // expect(res.body).to.include.keys('className');
            expect(res.body.className).to.equal(className);
            return Classes.findOne({ className });
            })
    });
});


describe('PUT', function () {
    it('should update a class', function() {
        const updateClass = {
            id: '123',
            firstName: 'John',
            className: 'BIO104',
            
        };
        return chai.request(app)
            .get('/classes/:studentID')
            .then(function(res) {
            updateClass.id = res.body[0].id;
            // console.log('updateClass.id', updateClass.id)
            return chai.request(app)
                .put(`/classes/${updateClass.id}`)
                .send(updateClass)
            })
            .then(function(res) {
            expect(res).to.have.status(204);
            // expect(res).to.be.json;
            // console.log(res.body, 'res.body')
            expect(res.body).to.be.a('object');
            expect(res.body).to.deep.equal(updateClass);
            });
    });
});


describe('DELETE', function () {
    it('should DELETE a class', function() {
        return chai.request(app)
            .get('/classes/:studentID')
            .then(function(res) {
            return chai.request(app)
                .delete(`/classes/${res.body[0].id}`);
            })
            .then(function(res) {
            expect(res).to.have.status(204);
            });
    });
});
});