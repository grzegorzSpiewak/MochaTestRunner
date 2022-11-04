// eslint-disable-next-line no-unused-vars
const { environment } = require('../../helpers');
const { expect } = require('chai');

describe('Test 1 service 1', async function () {
  it('test 1', function () {
    expect(1).to.be.eql(1);
  });

  it('test 3', function () {
    expect(1).to.be.eql(1);
  });

  it('test 4', function () {
    expect(1).to.be.eql(1);
  });

  it.skip('test 5 skipped', function () {
    expect(1).to.be.eql(1);
  });
});
