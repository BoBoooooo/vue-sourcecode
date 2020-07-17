/*
 * @file: 
 * @copyright: NanJing Anshare Tech .Com
 * @author: BoBo
 * @Date: 2020年07月16 15:21:39
 */ 
const path = require('path');

const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry : path.resolve(__dirname,'src/main.js'),
    output :{
        filename : 'src/js/[name]-[hash].js',
        path : path.resolve(__dirname,'dist')
    },
    devServer : {
        disableHostCheck : true
    },
    module : {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    plugins : [
        new htmlWebpackPlugin({
            filename : 'public/index.html',
            template : 'public/index.html',
            minify : {
                removeComments : true, //去注释
                collapseWhitespace : true //去空格
            }
        })
    ]
}
