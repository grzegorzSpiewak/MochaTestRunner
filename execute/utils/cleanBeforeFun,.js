const { rmSync, existsSync } = require('fs');

const pathsToRemove = [
  './mochawesome-report',
];

module.exports = () => {
  pathsToRemove.forEach(path => existsSync(path) ? rmSync(path, { recursive: true }) : null);
};
