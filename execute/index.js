/* eslint-disable no-console */
require('dotenv').config();

const Mocha = require('mocha');
const { mochaOpts } = require('./mochaOpts');
const { getCmdOpts } = require('../helpers');
const {
  cleanBeforeFun,
  getFilesForTest,
  checkTag,
  setReporters,
} = require('./utils');

cleanBeforeFun();

const cmdOpts = getCmdOpts();

const files = getFilesForTest(cmdOpts);
const taggedRun = checkTag(cmdOpts);
const withReport = setReporters(cmdOpts);

const opts = {
  ...mochaOpts,
  ...taggedRun,
  ...withReport,
};

const mochaMain = new Mocha(opts);

try {
  mochaMain.files = files;
  //  if more then 20 test failed break the Jenkins build
  mochaMain.run((failures) =>
    process.on('exit', (code) => {
      return process.exit(failures > 20 ? failures : code);
    })
  );
} catch (err) {
  console.log(`Failed to execute test run: ${err}`);
}
