const path = require( 'path' );
const isProduction = process.env.NODE_ENV === 'production';

const CopyPlugin = require( 'copy-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const IgnoreEmitPlugin = require( 'ignore-emit-webpack-plugin' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	...defaultConfig,
	entry: {
    	'./build/blocks': './js/blocks.js',
		'./build/editor': './css/editor.scss',
		'./build/style': './css/style.scss',
	},
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
	},
	externals: {
		// Externalizing lodash prevents an editor crash.
		// @see https://github.com/WordPress/gutenberg/issues/4043#issuecomment-633081315.
		'lodash': 'lodash',
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				style: {
					name: 'style',
					test: /style\.s?css$/,
					chunks: 'all',
					enforce: true,
				},
				editor: {
					name: 'editor',
					test: /editor\.s?css$/,
					chunks: 'all',
					enforce: true,
				},
			},
		},
		minimizer: [
			new TerserPlugin(
				{
					extractComments: false,
				}
			)
		],
	},
	watch: false,
	mode: isProduction ? 'production' : 'development',
	module: {
		rules: [
			{
				test: /\.js$/,
        		exclude: /(node_modules|vendor)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
		        test: /\.s?css$/,
		        exclude: /(node_modules|vendor)/,
				use: [
					{ loader: MiniCssExtractPlugin.loader },
					{ loader: 'css-loader' },
					{ loader: 'sass-loader' },
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(
			{ filename: './build/[name].css' }
		),
		new IgnoreEmitPlugin( [ 'editor.js', 'style.js' ] ),
		new CopyPlugin(
			{
				patterns: [
					{
						from: 'chart.min.*',
						to: './build/lib/chart.js/chart.min[ext]',
						context: './node_modules/chart.js/dist/'
					},
				],
			}
		),
	],
};
