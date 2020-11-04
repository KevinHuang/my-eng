const path = require('path');

// 不要打包 node_modules 的程式碼。
const NodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/server.ts',
    output: { //輸出位置。
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.bundle.js'
    },
    target: 'node',
    node: {
        __filename: true,
        __dirname: true
    },
    externals: [NodeExternals(), {
        config: 'commonjs ./config.json'
    }],
    module: {
        rules: [
            {
                test: /\.ts$/, // 先符合這條
                oneOf: [
                    {
                        use: 'ts-loader', // 上面都不符合就用這條。
                        parser: {
                            commonjs: true
                        },
                    }
                ]
            }
        ]
    },
    resolve: { // 如果這個沒有設定，TypeScript 會無法處理 import。
        // 需要指定 .js，不然有些東西還是會爆掉。
        extensions: [".ts", ".js"], // https://webpack.js.org/configuration/resolve/#resolve-extensions
    },

    // https://webpack.js.org/configuration/devtool/#devtool
    devtool: "source-map", // tsconfig.json 也要設定輸出 Source Map 才能運作。

    devServer: {
        // contentBase: path.join(__dirname, 'src'),
        compress: true,
        port: 9000,
        writeToDisk: true
    },

    // https://webpack.js.org/concepts/mode/
    mode: 'development', //設定為開發模式，天曉得會發生什麼事…
    plugins: [
        new CleanWebpackPlugin(), // 開發時每次都清掉會連 config.json 刪除但不會被回去。
        new CopyPlugin([{ from: './src/config.json' }], { copyUnmodified: true })
    ]
};