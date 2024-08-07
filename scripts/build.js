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
fs.writeFileSync(r('../README.md'), readme);

execSync('rm -rf ' + r('../dist/dist-types'), { stdio: 'inherit' });
execSync('rm -rf ' + r('../dist/tsdoc-metadata.json'), { stdio: 'inherit' });
