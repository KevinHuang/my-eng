/**
 * 處理清除相關 Output、Log 目錄。
 */
const { src } = require('gulp');
const clean = require('gulp-clean');
const print = require('gulp-print').default;
const { clientPath, serverPath } = require('./env.json');

const folders = [
    '../phonetic_deploy/public',
    'build',
    `${clientPath}/dist`,
    `${serverPath}/dist`,
    `${serverPath}/pm2`
]

exports.cleanup = (done) => {
    console.info('************** Cleanup Output **************');

    return src(folders, { read: false, allowEmpty: true })
        .pipe(print(filepath => {
            console.log(`刪除目錄：${filepath}`);
        }))
        .pipe(clean({ force: true }));
}