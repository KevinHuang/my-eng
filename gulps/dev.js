/**
 * 啟動開發環境。
 */
const { watch } = require('gulp');
const { spawn } = require('child_process');
const { clientPath, serverPath } = require('./env.json');
const fs = require('fs');
const path = require('path');

exports.mkcert = (done) => {
    console.log('************** 檢查憑證 **************');

    const certPath = path.join(clientPath, 'my-eng.appspot.com.pem');

    if(!fs.existsSync(certPath)) {
        console.log('建立本機憑證...');
        spawn('yarn', ['mkcert'], {
            cwd: clientPath,
            stdio: "inherit"
        }).once('close', () => done());
    } else {
        console.log('不需建立本機憑證...');
        done();
    }
}

exports.client_start = (done) => {
    console.info('************** Angular **************');
    spawn('yarn', ['start'], {
        cwd: clientPath,
        stdio: "inherit"
    });
    done();
}

exports.server_start_dev = (done) => {
    console.info('************** Service (Webpack) **************');

    watch([`${serverPath}/dist/server.*.js`])
        .once('add', () => done())
        .once('change', () => done());

    // 執行 webpack-dev-server。
    spawn('yarn', ['dev'], {
        cwd: serverPath,
        stdio: "inherit"
    });
}

exports.server_start_pm2 = (done) => {
    console.info('************** Service (PM2) **************');

    watch([`${serverPath}/pm2/*.log`])
    .once('add', () => done())
    .once('change', () => done());

    // 執行 pm2。
    const dev = spawn('yarn', ['pm2'], {
        cwd: serverPath,
        stdio: "inherit"
    });
}

exports.pm2_log = (done) => {
    console.info('************** PM2 Log **************');
    spawn('yarn', ['log'], {
        cwd: serverPath,
        stdio: "inherit"
    });
    done();
}