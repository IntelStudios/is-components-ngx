// this script executes ng build for each project we have
// each lib gets built into /dist

const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;
//joining path of directory
const directoryPath = path.join(__dirname, 'projects');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
        const proj = path.join(directoryPath, file);
        console.log('ng build '+file);
        exec('ng build '+file);
    });
});
