/* eslint-disable camelcase */
const logger = require('terminal-log');
const { isEmpty } = require('lodash');

const missingEnvErr = 'The -env param is required to execute tests. Example: DEV, QA, PROD';
const testToExecuteErr = 'The -service param is required to execute tests. Please provide name of folder in tests directory to execute test.';

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
    logger.warn('Following options can be passed as params:');
    logger.info('------------------------------------------');
    logger.ok('--env', 'environment on which tests can be run on, example: DEV, QA, PROD', 'required');
    logger.ok('--service', 'name of the folder in tests directory which includes test to be executed', 'required');
    logger.ok('--file', 'name of test file to be executed');
    logger.ok('--report', 'flag when passed triggers additional report default set to false');
    logger.ok('--dtab', 'dtab header used in production deployment to hit cold version of released code');
    logger.ok('--region', 'region to run test on. example: us-east-1, us-west-2 as default us-west-2 is passed');
    logger.ok('--tag', 'to trigger only tagged test, example: smoke');
    logger.ok('--trProjectName', 'name of project in Testrail to publish test');
    logger.ok('--trRunId', 'run id in Testrail to publish test');

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
  
  opts.env = npm_config_env.toLowerCase() || '';
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
