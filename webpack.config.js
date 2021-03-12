const path = require( 'path' );
const isProduction = process.env.NODE_ENV === 'production';

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const IgnoreEmitPlugin = require( 'ignore-emit-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
    	'./build/blocks': './src/blocks.js',
		'./build/editor': './src/editor.scss',
		'./build/style': './src/style.scss',
	},
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
	},
	externals: {
		// Prevents an editor crash. See https://github.com/WordPress/gutenberg/issues/4043#issuecomment-633081315.
		'lodash': 'lodash'
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
						from: 'Chart.min.*',
						to: './build/lib/chart.js/chart.min.[ext]',
						context: './node_modules/chart.js/dist/'
					},
				],
			}
		),
	],
	externals: {
	   'lodash': 'lodash'
	},
};
