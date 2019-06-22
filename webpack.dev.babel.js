import webpack from 'webpack';
import merge from 'webpack-merge';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import common from './webpack.common.babel';
import path from 'path';

const config = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: "babel-loader",
            exclude: /node_modules/
        }]
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                ENV: JSON.stringify('development'),
                NODE_ENV: JSON.stringify('development'),
                BASE_URL: JSON.stringify('/api')
            },
            __DEV__: JSON.stringify(true),
            __PROD__: JSON.stringify(false)
        }),
    ]
}

export default merge(common, config);