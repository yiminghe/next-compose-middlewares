import shell from 'shelljs';
let cmd = ['cypress run --e2e'];
if (process.env.CYPRESS_RECORD_KEY) {
  cmd.push('--record --key', process.env.CYPRESS_RECORD_KEY);
}
let { code } = shell.exec(cmd.join(' '));
shell.exec('sh scripts/report.sh');

shell.exit(code);
