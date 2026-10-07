const { spawn } = require('child_process');
const path = require('path');
const url = require('url');

const apiPath = url.pathToFileURL(path.resolve(__dirname, '../api/index.js')).href;

const child = spawn('node', ['--input-type=module', '-e', `
  // Empty process.env to simulate missing Vercel env vars
  process.env = { PATH: process.env.PATH, SYSTEMROOT: process.env.SYSTEMROOT, NODE_ENV: 'production' };
  import('${apiPath}').then((mod) => {
    console.log('MODULE_LOAD_SUCCESS');
  }).catch(err => {
    console.error('CRASH ON MODULE LOAD:', err);
    process.exit(1);
  });
`], {
  cwd: path.resolve('..'), // Run from parent dir so dotenv.config() doesn't find .env!
  stdio: ['inherit', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', d => stdout += d);
child.stderr.on('data', d => stderr += d);

child.on('close', code => {
  console.log('Exit code:', code);
  console.log('STDOUT:\n', stdout);
  console.log('STDERR:\n', stderr);
});
