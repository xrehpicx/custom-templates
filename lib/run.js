const cp = require('child_process');

function run(command, args, options = {}) {
    return new Promise((res, rej) => {
        const pr = cp.spawn(command, args, { stdio: [process.stdin, process.stdout, process.stderr], ...options });
        pr.on('exit', res);
        pr.on('error', rej);
    });
}
exports.run = run;
