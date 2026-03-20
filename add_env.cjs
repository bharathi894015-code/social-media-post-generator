const { spawn } = require('child_process');

const vars = [
  ["VITE_FIREBASE_API_KEY", "AIzaSyA17b_bfNUfscXN3-RK2JSdNr4EBRaCrgk"],
  ["VITE_FIREBASE_AUTH_DOMAIN", "post-generator-403b5.firebaseapp.com"],
  ["VITE_FIREBASE_PROJECT_ID", "post-generator-403b5"],
  ["VITE_FIREBASE_STORAGE_BUCKET", "post-generator-403b5.firebasestorage.app"],
  ["VITE_FIREBASE_MESSAGING_SENDER_ID", "420670065752"],
  ["VITE_FIREBASE_APP_ID", "1:420670065752:web:1b45ba01a5123a85174e2d"]
];

async function addVar(name, value, env) {
  return new Promise((resolve) => {
    console.log(`Adding ${name} to ${env}...`);
    const child = spawn('npx', ['vercel', 'env', 'add', name, value, env, '--yes'], { shell: true });

    child.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('sensitive?')) {
        child.stdin.write('N\n');
      }
    });

    child.on('close', (code) => {
      resolve();
    });
  });
}

async function run() {
  for (const v of vars) {
    await addVar(v[0], v[1], 'production');
    await addVar(v[0], v[1], 'preview');
  }
  console.log("Triggering final Vercel deployment...");
  spawn('npx', ['vercel', '--prod', '--yes'], { shell: true, stdio: 'inherit' });
}

run();
