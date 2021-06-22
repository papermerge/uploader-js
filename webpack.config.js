const path = require('path');

let glob = require("glob");
let entry_point = path.resolve(__dirname, 'uploader/index.js');
let output_path = path.resolve(__dirname, 'dist');
let output_filename = "uploader.bundle.js";
let mode = process.env.NODE_ENV == 'production' ? 'production' : 'development';


if ( process.env.TESTBUILD ) {
  entry_point = glob.sync(__dirname + "/tests/**/test_*.js");
  output_path = __dirname + "/test-dist/";
  output_filename = "tests.bundle.js";
}

module.exports = {
    mode: mode,
    output: {
        path: output_path,
        filename: output_filename,
        library: 'DocumentUploader',
    },
    entry: entry_point,
    module:  {
        rules: [
            {
                test: /\.svg/,
                type: 'asset/resource',
            },
            {
              test: /\.(sa|sc|c)ss$/,
              use: [
                // Creates `style` nodes from JS strings
                "style-loader",
                // Translates CSS into CommonJS
                "css-loader",
                // Compiles Sass to CSS
                "sass-loader",
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ],
    },
    resolve: {
        // I got this from here
        // https://stackoverflow.com/questions/28969861/managing-jquery-plugin-dependency-in-webpack
        alias: {
            'bootstrap-select-dropdown': "bootstrap-select-dropdown/src/js/bootstrap-select-dropdown"
        }
    },
    devtool: "source-map"
}


