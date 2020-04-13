'use strict';

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'js'),
        publicPath: '/js/',
        filename: 'game.bundle.js'
    },
    externals: {
          "phaser-ce": "Phaser"
      },
    module: {
        rules: []
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(pkg.version)
        })
    ]
};
