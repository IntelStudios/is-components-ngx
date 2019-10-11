// this script executes ng build for each project we have internal dependency
// lib gets built into /dist
const modules = ['is-core-ui', 'is-select'];
const exec = require('child_process').execSync;
console.info(`Building local modules ${modules.length}`);
modules.forEach(m => {
  console.info(`Building: ${m}`);
  exec(`ng build ${m}`);
});
console.info('Finished');
