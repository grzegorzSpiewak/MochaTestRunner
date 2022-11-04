const { isEmpty } = require('lodash');

module.exports = ({ trProjectName, report }) => {
  if (!report) return {};

  if (report && isEmpty(trProjectName)) {
    return {
      reporter: 'json',
      reporterOptions: {
        output: 'results/results.json',
      },
      // reporter: 'mocha-multi-reporters',
      // reporterOptions: {
      //   reporterEnabled: 'mochawesome, json',
      //   mochawesomeReporterOptions: {
      //     reportFilename: 'index',
      //     reportDir: 'results',
      //     json: false,
      //   },
      //   jsonReporterOptions: {
      //     output: 'results/results.json',
      //   },
      // },
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
