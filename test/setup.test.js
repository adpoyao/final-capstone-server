'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');


process.env.NODE_ENV = 'test';

process.stdout.write('\x1Bc\n');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Mocha and Chai', function() {
    it('should be properly setup', function() {
        expect(true).to.be.true;
    });
});

