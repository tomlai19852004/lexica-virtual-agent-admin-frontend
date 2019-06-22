import merge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import common from './webpack.common.babel';

const config = {
    mode: 'production',
    module: {},
    plugins: []
}

export default merge(common, config);