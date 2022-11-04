const { rmSync, existsSync } = require('fs');

const pathsToRemove = [
  './results',
];

module.exports = () => {
  console.log('remove');
  pathsToRemove.forEach(path => existsSync(path) ? rmSync(path, { recursive: true }) : null);
};
