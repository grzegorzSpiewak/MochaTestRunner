const { rmSync, existsSync } = require('fs');

const pathsToRemove = [
  './results',
];

module.exports = () => {
  pathsToRemove.forEach(path => existsSync(path) ? rmSync(path, { recursive: true }) : null);
};
