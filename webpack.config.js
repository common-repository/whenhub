const webpack = require('webpack');
const path = require('path');

module.exports = function (env) {

    return {
        entry: {
            editor: './src/editor.tsx',
        },
        output: {
            path: path.join(__dirname, 'build'),
            filename: '[name].js'
        },
        module: {
            rules: [{
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'awesome-typescript-loader']
            }, {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }]
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        }
    }

}