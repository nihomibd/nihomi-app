const { execSync } = require('child_process');

try {
  const result = execSync('node --input-type=module -e "import(\'./api/index.js\').then(() => console.log(\'SUCCESS_LOADED\')).catch(err => console.error(\'ERROR_LOADING:\', err));"', {
    cwd: process.cwd(),
    env: { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT },
    encoding: 'utf8'
  });
  console.log('Result:', result);
} catch (err) {
  console.log('Caught error:');
  console.log('STDOUT:', err.stdout);
  console.log('STDERR:', err.stderr);
}
