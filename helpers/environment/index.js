const config = require('../../config');
const getCmdOpts = require('../getCmdOpts');

const {
  env,
  region,
  dtab,
} = getCmdOpts();
const {
  baseUrl,
  api,
} = config[env][region];

module.exports = {
  baseUrl,
  api,
  dtab,
  region,
};
