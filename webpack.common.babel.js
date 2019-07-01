import webpack from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import path from 'path';

const config = {
    entry: {
        app: [
            './src/index.ts', 
            './src/theme/semantic.less'
        ],
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, "dist"),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        modules: ['node_modules'],
        alias: {
            '../../theme.config$': path.join(__dirname, 'src/theme/theme.config'),
            'c3.css': path.join(__dirname, 'node_modules/c3/c3.css'),
            'datepicker.css': path.join(__dirname, 'node_modules/react-dates/lib/css/_datepicker.css')
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        }
                    }
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    // 'extract-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                include: [/node_modules/]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader', 
                    'css-loader', 
                    'less-loader'
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: './tsconfig.json',
            tslint: './tslint.json',
            checkSyntacticErrors: true,
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            title: 'Lexica Open Source Virtual Agent',
            template: './src/index.html'
        })
    ]
}

export default config;