const { isEmpty } = require('lodash');

module.exports = ({ trProjectName, report }) => {
  if (!report) return {};

  if (report && isEmpty(trProjectName)) {
    return {
      reporter: 'mochawesome',
      reporterOptions: {
        reportFilename: 'index',
        reportDir: 'results',
        json: false,
      },
    };
  };

  if (report && !isEmpty(trProjectName)) {
    return {
      reporter: 'mocha-multi-reporters',
      reporterOptions: {
        reporterEnabled: 'mochawesome, ./execute/testRailReporter',
        mochawesomeReporterOptions: {
          reportFilename: 'results/report',
        },
      },
    };
  };
};
