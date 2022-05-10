const fs = require('fs');
const path = require('path');

/**
 * @param {string} directory
 * @returns {string[] | null}
 */
function listDirAbsolute(directory) {
  if (!fs.lstatSync(directory).isDirectory()) {
    return null;
  }
  return fs.readdirSync(directory).map((child) => path.join(directory, child));
}

/**
 * @param {string} path
 * @returns {string[]}
 */
function locateIcons(path) {
  const children = listDirAbsolute(path);
  if (children === null) {
    if (path.endsWith('.scss') || path.endsWith('.ts')) {
      const content = fs.readFileSync(path, {encoding: 'utf8'});
      const re = /["']((?:.^["']){0,30}?fa.*?\s+fa.*?)['"]/g;

      return [...content.matchAll(re)].map((match) => match[1]);
    }
    return [];
  }

  return children
    .map((child) => locateIcons(child))
    .reduce((acc, val) => acc.concat(val), []);
}

console.log(locateIcons('projects').map((icon) => {
  return `<div class="icon-box"><i class="${icon}"></i><span><pre>${icon}</pre></span></div>`;
}).join('\n'));
