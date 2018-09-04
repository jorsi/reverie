const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './src/client'
    },
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    devServer: {
        proxy: {
            '/socket': {
                target: 'ws://localhost:3000',
                ws: true,
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(['dist/client']),
        new HtmlWebpackPlugin({
            title: 'Reverie'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist/client'),
        filename: '[name]-client.js'
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, "dist"),
        ],
        extensions: ['.ts', '.js', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFile: 'src/client/tsconfig.json'
                }
            }
        ]
    }
}