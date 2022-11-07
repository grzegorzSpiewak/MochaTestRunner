// eslint-disable-next-line no-unused-vars
const { environment } = require('../../helpers');
const { expect } = require('chai');
const { describe } = require('mocha');

describe('Section test 1 service B', async function () {
  it('first test', function () {
    expect(1).to.be.eql(1);
  });

  describe('nested', function () {
    it('nested test', function () {
      expect(1).to.be.eql(2);
    });

    it.skip('nested test', function () {
      expect(1).to.be.eql(2);
    });
  });
});
