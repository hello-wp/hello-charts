const path = require( 'path' );
const isProduction = process.env.NODE_ENV === 'production';

const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const IgnoreEmitPlugin = require( 'ignore-emit-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );

module.exports = {
	entry: {
    './build/blocks': './src/blocks.js',
	},
	output: {
		path: path.resolve( __dirname ),
		filename: '[name].js',
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
					{
						loader: MiniCssExtractPlugin.loader,
					},
          {
						loader: 'css-loader',
					},
          {
						loader: 'postcss-loader',
						options: {
							plugins: [ require( 'autoprefixer' ) ],
						},
					},
					{
						loader: 'sass-loader',
            options: {
              // Add common CSS file for variables and mixins.
              additionalData: '@import "./src/common.scss";\n',
            },
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
      filename: './build/[name].css',
    }),
    new IgnoreEmitPlugin( [ 'editor.js', 'style.js' ] ),
    new CopyPlugin({
      patterns: [
        { from: 'Chart.min.*', to: './build/lib/chart.js/chart.min.[ext]', context: './node_modules/chart.js/dist/' },
      ],
    }),
	],
};
