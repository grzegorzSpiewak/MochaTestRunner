// eslint-disable-next-line no-unused-vars
const { environment } = require('../../helpers');
const { expect } = require('chai');
const { describe } = require('mocha');

describe('Section test b service A', async function () {
  it('test 1', function () {
    expect(1).to.be.eql(1);
  });

  describe('nested', function () {
    it('nested test 2.1', function () {
      expect(1).to.be.eql(1);
    });
  });

  describe('nested', function () {
    it('nested test 2.2', function () {
      expect(1).to.be.eql(2);
    });
  });
});
