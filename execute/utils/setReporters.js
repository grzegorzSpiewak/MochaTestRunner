const { isEmpty } = require('lodash');

module.exports = ({ trProjectName, report }) => {
  if (!report) return {};

  if (report && isEmpty(trProjectName)) {
    return {
      reporter: 'json',
      reporterOptions: {
        output: './results/data.json',
      },
    };
  };

  if (report && !isEmpty(trProjectName)) {
    return {
      reporter: 'mocha-multi-reporters',
      reporterOptions: {
        reporterEnabled: 'spec, ./execute/testRailReporter',
        mochawesomeReporterOptions: {
          reportFilename: 'index',
          reportDir: 'results',
          json: false,
        },
      },
    };
  };
};
