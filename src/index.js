'use strict';

const
  build = require('./build.js'),
  parser = require('./parser.js'),
  loaderUtils = require('loader-utils');

/**
 * Main function
 * @param   {String}  content   Markdown file content
 */
module.exports = function (content) {
  const callback = this.async();

  const options = loaderUtils.getOptions(this) || {};

  parser
    .parse(content)
    .then(result => build(result, options))
    .then(component => callback(null, component))
    .catch(callback);

};
