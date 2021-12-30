/*
 * @Description: 
 * @Author: tj
 * @Date: 2021-09-23 15:03:02
 * @LastEditTime: 2021-12-30 14:45:34
 * @LastEditors: tj
 */
const path = require('path');
const webpack = require("webpack");
const uglify = require("uglifyjs-webpack-plugin");
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = (evn, arg) => {
    const devMode = arg.mode === 'development';
    let config = {
        entry: './src/index.js', //相对路径
        output: {
            path: path.resolve(__dirname, './dist'), //打包文件的输出路径
            publicPath: '/dist/',

            filename: 'index.js',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React',
            },
            'react-dom': {
                commonjs: 'react-dom',
                commonjs2: 'react-dom',
                amd: 'react-dom',
                root: 'ReactDOM',
            },
        },
        module: {
            rules: [
                {
                    test: /\.(js)$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /.css$/,
                    use: 'css?sourceMap&modules&localIdentName=[local]___[hash:base64:5]!!',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        devMode ? { loader: "style-loader" } : MiniCssExtractPlugin.loader,
                        { loader: "css-loader" },
                        { loader: "less-loader" }
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: '[name].[ext]?[hash]'
                    },
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name]-[hash:5].[ext]'  //这里img是存放打包后图片文件夹，结合publicPath来看就是/webBlog/build/img文件夹中，后边接的是打包后图片的命名方式。
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].css',
                chunkFilename: devMode ? '[id].css' : '[id].css',
            }),
            new htmlWebpackPlugin({
                template: 'public/index.html'
            })
            
            
        ]
    }
    return config;
}