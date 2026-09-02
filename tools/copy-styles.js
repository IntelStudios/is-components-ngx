const fs = require('fs');
const path = require('path');

const sourceFile = path.join(__dirname, '../projects/styles');
const destPath = path.join(__dirname, '../dist/is-core-ui/scss');

try {
  fs.cpSync(sourceFile, destPath, { recursive: true });
  console.log('Styles has been copied');
} catch (err) {
  console.error(err);
  process.exit(1);
}
