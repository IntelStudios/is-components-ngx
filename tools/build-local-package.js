const { execSync } = require('child_process');
const path = require('path');

const projectFlag = process.argv.indexOf('--project');
const project = projectFlag !== -1 ? process.argv[projectFlag + 1] : undefined;

if (!project) {
  console.error('--project parameter is required (e.g. pnpm run build -- --project is-cdk)');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/i.test(project)) {
  console.error(`Invalid --project value: ${project}`);
  process.exit(1);
}

const root = path.join(__dirname, '..');
const projectDist = path.join(root, 'dist', project);

console.info(`Building local module ${project}`);

const run = (command, cwd = root) =>
  execSync(command, { stdio: 'inherit', cwd, env: process.env });

run(`pnpm exec ng build ${project} --configuration production`);

if (project === 'is-core-ui') {
  run(`node ${path.join(__dirname, 'copy-styles.js')}`);
}

run('pnpm pack', projectDist);
run('cp *.tgz ..', projectDist);

console.info(`${project} NPM package built in [${path.join(root, 'dist')}] folder`);
