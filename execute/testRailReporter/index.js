const mocha = require('mocha');

const {
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_RUN_BEGIN,
  EVENT_TEST_PENDING,
} = mocha.Runner.constants;

module.exports = class TestRailReporter {
  constructor (runner, options) {
    mocha.reporters.Base.call(this, runner);
    this.runner = runner;

    this.runner.on(EVENT_RUN_BEGIN, () => {
      console.log('began');
    });

    this.runner.on(EVENT_TEST_PASS, (test) => {
      console.log('pass');
    });

    this.runner.on(EVENT_TEST_FAIL, (test) => {
      console.log('fail');
    });

    this.runner.on(EVENT_TEST_PENDING, (test) => {
      console.log('pening');
    });

    this.runner.on(EVENT_RUN_END, () => {
      console.log('end');
    });
  }
};
