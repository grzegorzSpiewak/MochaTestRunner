// eslint-disable-next-line no-unused-vars
const { environment } = require('../../helpers');
const { skipIf } = require('../../extensions');
const { expect } = require('chai');

describe('Section test 1 service A', async function () {
  skipIf(() => true);
  
  it('test 1', function () {
    expect(1).to.be.eql(1);
  });

  it('tets 2', function () {
    expect(1).to.be.eql(1);
  });
});
