// this script executes ng build for each project we have internal dependency
// lib gets built into /dist

const exec = require('child_process').execSync;
exec('ng build is-select');
exec('ng build is-selectpicker');
exec('ng build is-metronic');
