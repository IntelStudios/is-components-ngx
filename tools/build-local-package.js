const argv = require("yargs").string("project").argv;

const dist = "../dist";

const project = argv.project;
if (!project) {
  console.error("--project parameter is required");
  process.exit(1);
}

const exec = require("child_process").execSync;

console.info(`Building local module ${project}`);
const postBuild = project === 'is-core-ui' ? '&& node copy-styles.js' : '';
exec(
  `npx ng build ${project} --prod ${postBuild} && cd ${dist}/${project} && npm pack --quiet && cp *.tgz ../`
);

console.info(`${project} NPM package built in [${dist}] folder`);
