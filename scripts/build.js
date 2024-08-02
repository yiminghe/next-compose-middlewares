const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function r(...p) {
  return path.join(__dirname, ...p);
}

const md = fs.readFileSync(
  r('../etc/next-compose-middlewares.api.md'),
  'utf-8',
);

let readme = fs.readFileSync(r('../README.md'), 'utf-8');

const start = readme.indexOf(
  '## API Report File for "next-compose-middlewares"',
);
const end = readme.indexOf('---------');

readme = readme.slice(0, start) + md + readme.slice(end);
const pkg = require('../package.json');
fs.writeFileSync(r('../README.md'), readme);
fs.writeFileSync(
  r('../dist/package.json'),
  JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      repository: pkg.repository,
      dependencies: pkg.dependencies,
    },
    null,
    2,
  ),
);

fs.copyFileSync(r('../README.md'), r('../dist', 'README.md'));

execSync('rm -rf ' + r('../dist/dist-types'), { stdio: 'inherit' });
execSync('rm -rf ' + r('../dist/tsdoc-metadata.json'), { stdio: 'inherit' });
