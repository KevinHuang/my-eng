const { spawn } = require('child_process');
const { clientPath, serverPath } = require('./env.json');

exports.install_angular = (done) => {
    console.info('************** install angular node_modules **************');
    spawn('yarn', [], {
        cwd: clientPath,
        stdio: "inherit"
    }).once('close', () => done());
}

exports.install_service_modules = (done) => {
    console.info('************** install service node_modules **************');
    spawn('yarn', [], {
        cwd: serverPath,
        stdio: "inherit"
    }).once('close', () => done());
}
