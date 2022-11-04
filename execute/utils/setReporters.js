const { isEmpty } = require('lodash');

module.exports = ({ trProjectName, report }) => {
  if (!report) return {};

  if (report && isEmpty(trProjectName)) {
    return {
      reporter: 'mocha-multi-reporters',
      reporterOptions: {
        reporterEnabled: 'mochawesome, xunit',
        mochawesomeReporterOptions: {
          reportFilename: 'index',
          reportDir: 'results',
          json: false,
        },
        xunitReporterOptions: {
          output: 'results/results.xml',
        },
      },
    };
  };

  if (report && !isEmpty(trProjectName)) {
    return {
      reporter: 'mocha-multi-reporters',
      reporterOptions: {
        reporterEnabled: 'mochawesome, ./execute/testRailReporter',
        mochawesomeReporterOptions: {
          reportFilename: 'index',
          reportDir: 'results',
          json: false,
        },
      },
    };
  };
};
