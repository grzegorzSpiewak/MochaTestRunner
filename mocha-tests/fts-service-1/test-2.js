// eslint-disable-next-line no-unused-vars
const { environment } = require('../../helpers');
const { expect } = require('chai');

describe('Test 2 service 1', async function () {
  it('test 2', function () {
    expect(1).to.be.eql(1);
  });

  describe('with nested describe', function () {
    it('nested test 2 -skip', function () {
      expect(1).to.be.eql(1);
    });

    it('nested test 2', function () {
      expect(1).to.be.eql(1);
    });
  });
});
