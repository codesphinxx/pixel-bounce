'use strict';

const TransformJson = require('transform-json-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

let pkg = JSON.parse(fs.readFileSync(__dirname + '/package.json').toString());
let banner = fs.readFileSync(__dirname + '/.banner').toString();
banner = banner.replace('{version}', pkg.version).replace('{date}', (new Date()).toDateString());

let plugins = [];
plugins.push(new webpack.BannerPlugin({
  banner: banner
}));
plugins.push(new webpack.DefinePlugin({
    'CANVAS_RENDERER': JSON.stringify(true),
    'WEBGL_RENDERER': JSON.stringify(true)
  }));
plugins.push(new TransformJson({
    filename: '../../package.json',
    source: `${__dirname}/package.json`,
    object: {
        dependencies: { "express": "^4.17.1" },
        devDependencies: {},
        scripts: {
            "start": "node server.js"
        }
    }
}));
plugins.push(new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(pkg.version)
}));
plugins.push(new CopyWebpackPlugin([
    { from: path.resolve(__dirname,'./node_modules/phaser-ce/build/phaser.min.js'), to: path.resolve(__dirname,'build/public/js') },
    { from: path.resolve(__dirname,'./node_modules/phaser-ce/build/phaser.map'), to: path.resolve(__dirname,'build/public/js') },
    { from: path.resolve(__dirname,'server.js'), to: path.resolve(__dirname,'build') },
    { from: path.resolve(__dirname,'index.html'), to: path.resolve(__dirname,'build/public') },
    { from: path.resolve(__dirname,'offline.html'), to: path.resolve(__dirname,'build/public') },
    { from: path.resolve(__dirname,'manifest.json'), to: path.resolve(__dirname,'build/public') },
    { from: path.resolve(__dirname,'favicon.ico'), to: path.resolve(__dirname,'build/public') },
    { from: path.resolve(__dirname,'service-worker.js'), to: path.resolve(__dirname,'build/public') }
  ]));
plugins.push(new CopyWebpackPlugin([
    { from: path.resolve(__dirname,'assets'), to: path.resolve(__dirname,'build/public/assets'), toType: 'dir' },
    { from: path.resolve(__dirname,'lib'), to: path.resolve(__dirname,'build/public/lib'), toType: 'dir' },
    { from: path.resolve(__dirname,'fonts'), to: path.resolve(__dirname,'build/public/fonts'), toType: 'dir' },
    { from: path.resolve(__dirname,'css'), to: path.resolve(__dirname,'build/public/css'), toType: 'dir' },
    { from: path.resolve(__dirname,'icons'), to: path.resolve(__dirname,'build/public/icons'), toType: 'dir' }
  ]));

module.exports = {

    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'build/public/js'),
        filename: 'game.bundle.js'
    },
    externals: {
          "phaser-ce": "Phaser"
      },
    module: {
        rules: []
    },
    optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            extractComments: false,
            terserOptions: {
              mangle: true, 
            },
          }),
        ],
    },
    plugins: plugins
};
