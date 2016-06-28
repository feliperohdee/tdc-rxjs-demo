var webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    notifier = require('webpack-notifier'),
    base = {
    cache: true,
    debug: true,
    verbose: true,
    devtool: 'source-map',
    entry: {
        'bundle': ['./src/client/index.tsx'],
        'vendor': ['./src/client/vendor.ts'],
    },
    output: {
        path: '__client__',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }, {
            test: /\.tsx$/,
            loader: 'ts-loader'
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        },, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css-loader')
        }, {
            test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader?mimetype=application/font-woff&name=fonts/[name].[ext]'
        }, {
            test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader?mimetype=application/x-font-ttf&name=fonts/[name].[ext]'
        }, {
            test: /\.eot(\?v=\d+\.\d+\.\d+)?\??$/,
            loader: 'file-loader?mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]'
        }, {
            test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader?mimetype=application/font-otf&name=fonts/[name].[ext]'
        }, {
            test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader?mimetype=image/svg+xml&name=fonts/[name].[ext]'
        }, {
            test: /\.png$/,
            loader: 'file-loader?name=images/[name].[ext]'
        }],
        noParse: [
            /\.min\.js/
        ]
    },
    ts: {
        configFileName: 'tsconfig.client.json'
    }
}

if (process.env.NODE_ENV === 'production') {
    base.plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'common.js',
            chunks: ['vendor', 'bundle']
        }),
        new notifier({
            title: 'Client built'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin('[name].css')
    ]
} else {
    base.plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: 'common.js',
            chunks: ['vendor', 'bundle']
        }),
        new notifier({
            title: 'Client built'
        }),
        new ExtractTextPlugin('[name].css')
    ]
}

module.exports = base;
