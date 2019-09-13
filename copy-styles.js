const fse = require("fs-extra");
const path = require("path");

async function copyAssets() {
  try {
    const sourceFile = path.join(__dirname, "projects/styles");
    const destPath = path.join(__dirname, "dist/is-core-ui/scss");
    await fse.copy(sourceFile, destPath);
    console.log("Styles has been copied");
  } catch (err) {
    console.error(err);
  }
}
copyAssets();
