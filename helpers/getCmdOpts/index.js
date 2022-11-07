/* eslint-disable camelcase */
const logger = require('terminal-log');
const { isEmpty } = require('lodash');

const missingEnvErr = 'The -env param is required to execute tests. Example: DEV, QA, PROD';
const testToExecuteErr = 'The -service param is required to execute tests. Please provide name of folder in mocha-tests directory to execute test.';

// Parses all params which are passed by command line
module.exports = () => {
  const {
    npm_config_env,
    npm_config_service,
    npm_config_info,
    npm_config_file,
    npm_config_report,
    npm_config_dtab,
    npm_config_region,
    npm_config_tag,
    npm_config_trprojectname,
    npm_config_trrunid,
  } = process.env;

  if (npm_config_info) {
    logger.info('Following options can be passed as params:');
    logger.info('--env - environment on which tests can be run on, example: DEV, QA, PROD - required');
    logger.info('--service - name of the folder in mocha-tests directory which includes test to be executed - required');
    logger.info('--file - name of test file to be executed');
    logger.info('--report - flag when passed triggers additional report - default set to false');
    logger.info('--dtab - dtab header used in production deployment to hit cold version of released code');
    logger.info('--region - region to run test on. example: us-east-1, us-west-2 - as default us-west-2 is passed');
    logger.info('--tag - to trigger only tagged test, example: smoke');
    logger.info('--trProjectName - name if project in Testrail to publish test');
    logger.info('--trRunId - name if project in Testrail to publish test');

    return process.exit(1);
  }

  const opts = {};

  if (isEmpty(npm_config_env)) {
    logger.error(missingEnvErr);
    return process.exit(1);
  }

  if (isEmpty(npm_config_service)) {
    logger.error(testToExecuteErr);
    return process.exit(1);
  }
  
  opts.env = npm_config_env || '';
  opts.service = npm_config_service || '';
  opts.file = npm_config_file || '';
  opts.report = npm_config_report || false;
  opts.dtab = npm_config_dtab || '';
  opts.region = npm_config_region || 'us-west-2'; // Default value will be west
  opts.tag = npm_config_tag || '';
  opts.trProjectName = npm_config_trprojectname || '';
  opts.trRunId = npm_config_trrunid || '';

  return opts;
};
