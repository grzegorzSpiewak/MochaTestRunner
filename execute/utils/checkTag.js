const { isEmpty } = require('lodash');
module.exports = ({ tag }) => isEmpty(tag) ? {} : { grep: tag };
