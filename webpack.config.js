const devMode = process.env.NODE_ENV !== 'production'
const { resolve } = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
	entry: devMode
		? [
				'./src/scripts/index.js',
				'./src/styles/index.css',
				'webpack-plugin-serve/client'
		  ]
		: ['./src/scripts/index.js', './src/styles/index.css'],
	output: {
		path: resolve(__dirname, 'dist'),
		filename: 'index.js',
		publicPath: '../'
	},
	mode: devMode ? 'development' : 'production',
	devtool: devMode && 'eval',
	watch: devMode,
	optimization: !devMode
		? {
				minimizer: [
					new UglifyJsPlugin({
						cache: true,
						parallel: true
					}),
					new OptimizeCSSAssetsPlugin({})
				]
		  }
		: {},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: 'ie > 10' }]]
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					}
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'index.css'
		}),
		new Serve({
			hmr: false,
			liveReload: true,
			port: 1337
		})
	],
	stats: {
		all: false,
		assets: true,
		colors: true,
		errors: true,
		warnings: true
	}
}
