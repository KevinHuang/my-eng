/**
 * 刪除記憶體中相關 Process。
 */
const { exec } = require('child_process');
const { clientPath, serverPath } = require('./env.json');

// 防止 ng serve 死在 memory 中。
exports.ng_serve = (done) => {
    // kill -9 `ps -ef | grep 'ng serve' | grep -v grep |  awk '{print $2}'`
    console.info('************** Kill Angular **************');
    exec("kill -9 `ps -ef | grep 'ng serve' | grep -v grep |  awk '{print $2}'`", {
        cwd: clientPath
    }).once('close', () => {
        done();
    })
}

// 防止 webpack 死在 memory 中。
exports.webpack = (done) => {
    // kill -9 `ps -ef | grep 'webpack' | grep -v grep |  awk '{print $2}'`
    console.info('************** Kill Webpack **************');
    exec("kill -9 `ps -ef | grep 'webpack' | grep -v grep |  awk '{print $2}'`", {
        cwd: serverPath
    }).once('close', () => {
        done();
    })
}

// 先把之前的啟動刪除。
exports.pm2 = (done) => {
    // pm2 delete protal-service
    console.info('************** Kill PM2 **************');
    exec(`pm2 delete hlc_phonetic_server`, {
        cwd: serverPath
    }).once('close', () => {
        done();
    })
}
