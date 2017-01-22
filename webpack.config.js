"use strict";
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");

const ENVIRONMENT = process.env.NODE_ENV || 'development';
const PORT = 3000;
const PUBLIC_PATH = ENVIRONMENT === 'development' ? `http://localhost:${PORT}/` : '/';


module.exports = {
    context: path.resolve(__dirname, "app"),
    devtool: "cheap-module-eval-source-map",
    devServer: {
        port: PORT,
        host: 'localhost',
        historyApiFallback: true,
        noInfo: false,
        stats: 'minimal',
        publicPath: PUBLIC_PATH,
        compress: true,
        hot: true,
        open: true
    },
    entry: {
        vendors: Object.keys(require("./package.json").dependencies),
        app: [
            path.resolve(__dirname, 'assets', 'styles', 'app.scss'),
            "./bootstrap.js"
        ]
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "[name].bundle.js",
        publicPath: PUBLIC_PATH,
        sourceMapFilename: '[name].map'
    },
    resolve: {
        extensions: [ ".js", ".scss", ".css" ],
        modules: [
            path.join(__dirname, 'app'),
            'node_modules'
        ],
        alias: {
            core: path.resolve(__dirname, 'app', 'core'),
            images: path.resolve(__dirname, 'assets', 'media', 'images')
        }
    },
    performance: {
        hints: ENVIRONMENT === 'production'
            ? "warning"
            : false
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ng-annotate-loader",
                        options: {
                            add: true
                        }
                    }, {
                        loader: "babel-loader"
                    }
                ]
            }, {
                test: /\.s(c|a)ss/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: [
                        {
                            loader: "css-loader",
                            query: {
                                modules: false,
                                sourceMap: true
                            }
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: "sass-loader",
                            query: {
                                sourceMap: true,
                                sourceMapContents: true,
                                includePaths: [path.resolve(__dirname, 'assets', 'media', 'images')],
                                data: `$env: ${ENVIRONMENT};`
                            }
                        }
                    ]
                })
            }, {
                test: /\.pug/,
                use: [
                    {
                        loader: "pug-html-loader",
                        options: {
                            pretty: false
                        }
                    }
                ]
            }, {
                test: /\.(otf|ttf|eot|woff|woff2|png|ico|jpg|jpeg|gif|svg)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/static/[ext]/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors'
        }),
        new HtmlPlugin({
            template: path.join(__dirname, "app", "index.html"),
            chunksSortMode: 'dependency',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),
        new ExtractTextPlugin({
            filename: "[name].css",
            allChunks: true,
            disable: ENVIRONMENT === 'development'
        }),
        new webpack.ProvidePlugin({'_': 'lodash'}),
        new webpack.DefinePlugin({
            'NODE_ENV': JSON.stringify(ENVIRONMENT),
            'process.env': {
                'NODE_ENV': JSON.stringify(ENVIRONMENT)
            }
        })
        // new webpack.LoaderOptionsPlugin({
        //     minimize: true,
        //     debug: false
        // }),
        // new UglifyJsPlugin({
        //     beautify: false,
        //     mangle: {
        //         screw_ie8: true,
        //         keep_fnames: true
        //     },
        //     compress: {
        //         screw_ie8: true
        //     },
        //     comments: false
        // })
    ]
};
