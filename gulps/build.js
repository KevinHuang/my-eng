/**
 * 處理建置相關指令。
 */
const { spawn } = require('child_process');
const { series, src, dest } = require('gulp');
const rename = require("gulp-rename");
const { clientPath, serverPath } = require('./env.json');
const jeditor = require("gulp-json-editor");

exports.build_client = (done) => {
    console.info('************** 開始建置 Angular **************');
    spawn('yarn', ['build', '--prod'], {
        cwd: clientPath,
        stdio: "inherit"
    }).once('close', () => done());
}

exports.build_service = (done) => {
    console.info('************** 打包 Service **************');
    spawn('yarn', ['build'], {
        cwd: serverPath,
        stdio: "inherit"
    }).once('close', () => done());
}

// 複製相關輸出檔案到 deploy 目錄。
exports.copy = series(
    () => {
        return src(`${serverPath}/dist/**`)
            .pipe(dest('./build'));
    }, () => {
        return src(`${clientPath}/dist/phonetic_client/**`)
            .pipe(dest('./build/public'));
    }, () => {
        return src([`${serverPath}/package.json`])
            .pipe(dest('./build'))
    }, () => {
        return src([`${serverPath}/ecosystem.config.prod.js`])
            .pipe(rename('ecosystem.config.js'))
            .pipe(dest('./build'))
    });

exports.deploy = series(
    () => {
        return src(`./build/**`)
            .pipe(dest('../phonetic_deploy'));
    },
    () => {
        return src(`./build/config.json`)
            .pipe(
                jeditor({
                    db: {
                        host: '127.0.0.1',
                        password: "password",
                    }
                }))
            .pipe(rename('config.json.template'))
            .pipe(dest('../phonetic_deploy'))
    }
)
