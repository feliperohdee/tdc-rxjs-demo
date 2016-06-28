var webpack = require('webpack');
var notifier = require('webpack-notifier');
var base = {
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
        publicPath: '__client__',
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
        })
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
        })
    ]
}

module.exports = base;
