const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function r(...p) {
  return path.join(__dirname, ...p);
}
execSync('rm -rf ' + r('../docs'), { stdio: 'inherit' });
execSync(
  'pnpm api-documenter markdown --input-folder=temp --output-folder=docs',
);
execSync('rm -rf ' + r('../dist/dist-types'), { stdio: 'inherit' });
execSync('rm -rf ' + r('../dist/tsdoc-metadata.json'), { stdio: 'inherit' });
