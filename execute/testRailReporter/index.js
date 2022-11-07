/* eslint-disable no-console */
const mocha = require('mocha');
const { getCmdOpts } = require('../../helpers');
const {
  prepareResults,
  publishResultsToRun,
  publishResultsToTestRail,
} = require('./publishers');
const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING,
} = mocha.Runner.constants;
const {
  trProjectName,
  trRunId,
  service,
} = getCmdOpts();

module.exports = class TestrailReporter {
  constructor (runner) {
    mocha.reporters.Base.call(this, runner);
    this.runner = runner;
    this.data = [];

    this.runner.on(EVENT_TEST_PASS, (test) => {
      const section = test.titlePath()[0];
      const title = test.title;
      this.data.push({
        service,
        section,
        title,
        pass: true,
      });
    });

    this.runner.on(EVENT_TEST_FAIL, (test, err) => {
      const section = test.titlePath()[0];
      const title = test.title;
      this.data.push({
        service,
        section,
        title,
        pass: false,
        comment: err.message,
      });
    });

    this.runner.on(EVENT_TEST_PENDING, (test) => {
      const section = test.titlePath()[0];
      const title = test.title;
      this.data.push({
        service,
        section,
        title,
        pass: false,
        skipped: true,
      });
    });

    this.runner.on(EVENT_RUN_END, () => {
      const results = prepareResults(this.data, service);

      if (trProjectName) {
        if (trRunId) {
          publishResultsToRun(results, trRunId);
        } else {
          publishResultsToTestRail(results, trProjectName);
        }
      }
    });
  }
};
