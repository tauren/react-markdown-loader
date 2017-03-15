'use strict';
const camelize = require('camelize');
const except = require('except');

const defaultTemplateFn = (jsx, frontMatterAttributes, doImports) => `
${doImports}

export const attributes = ${frontMatterAttributes};
export default function() {
  return (
    <div>
      ${jsx}
    </div>
  );
};`;

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Builds the React Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */
module.exports = function build(markdown, options = {}) {

  let doImports = 'import React from \'react\';\n';
  const
    imports = markdown.attributes.imports || {},
    jsx = markdown.html.replace(/class=/g, 'className=');

  const frontMatterAttributes = except(markdown.attributes, 'imports');

  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`;
    }
  }

  const templateFn = options.templates.default || defaultTemplateFn;
  return templateFn(jsx, JSON.stringify(camelize(frontMatterAttributes)), doImports);
};
