const logger = require('terminal-log');
const read = require(('fs-readdir-recursive'));
const { readdirSync, existsSync } = require('fs');
const { isEmpty } = require('lodash');

module.exports = ({ service, file }) => {
  let files = [];
  const dir = 'execute/utils';
  const testDir = 'mocha-tests';

  if (service === 'all') {
    const validate = __dirname.replace(dir, `${testDir}`);
    files = read(validate).map(path => `${testDir}/${path}`);
    return files;
  }

  const testPath = isEmpty(file) ? `${service}` : `${service}/${file}`;
  const validate = __dirname.replace(dir, `${testDir}/${testPath}`);

  if (testPath.includes('.js')) {
    const filePath = `${testDir}/${testPath}`;

    if (!existsSync(filePath)) {
      logger.error(`The ${testPath} test does not exist in that. Make sure you are passing correct data`);
      return process.exit(1);
    }
    
    files.push(filePath);
    
    return files;
  }

  try {
    readdirSync(validate)
      .forEach(fileName =>
        !isEmpty(fileName) && fileName.includes('.js')
          ? files.push(`${testDir}/${testPath}/${fileName}`)
          : null
      );
  } catch (e) {
    logger.error('No files found to execute test. Make sure you are passing existing service name');
    return process.exit(1);
  }

  return files;
};
