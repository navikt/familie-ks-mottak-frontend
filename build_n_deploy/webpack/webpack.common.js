const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TypeScriptTypeChecker = require('fork-ts-checker-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    entry: {
        'familie-ks-mottak': ['./src/frontend/index.tsx'],
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'tslint-loader',
                enforce: 'pre',
            },
            {
                test: /\.(js|ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                },
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
        runtimeChunk: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, '../../src/frontend/index.html'),
            inject: 'body',
            alwaysWriteToDisk: true,
        }),
        new TypeScriptTypeChecker(),
        new webpack.NoEmitOnErrorsPlugin(),
        new OptimizeCssAssetsPlugin(),
    ],
};
