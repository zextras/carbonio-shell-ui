const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const pkg = require('./zapp.conf.js');

const babelRCApp = require('./babel.config.app.js');
const babelRCServiceworker = require('./babel.config.serviceworker.js');

module.exports = [{
	mode: 'development',
	entry: {
		index: path.resolve(process.cwd(), 'src', 'index.js')
	},
	devtool: 'source-map',
	output: {
		path: path.resolve(process.cwd(), 'build'),
		filename: '[name].[hash:8].js',
		chunkFilename: '[name].[chunkhash:8].chunk.js',
		publicPath: '/'
	},
	target: 'web',
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx']
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
				options: babelRCApp
			},
			{
				test: /\.(css)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: process.env.NODE_ENV === 'development'
						}
					},
					{
						loader: require.resolve('css-loader'),
						options: {
							modules: {
								localIdentName: '[name]__[local]___[hash:base64:5]'
							},
							importLoaders: 1,
							sourceMap: true
						}
					},
					{
						loader: require.resolve('postcss-loader'),
						options: {
							sourceMap: true
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif|woff2?|svg|eot|ttf|ogg|mp3)$/,
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {}
					}
				]
			},
			{
				test: /\.properties$/,
				use: [{
					loader: path.resolve(
						process.cwd(), 
						'node_modules', 
						'@zextras', 
						'zapp-cli', 
						'utils', 
						'properties-loader.js'
					)
				}]
			}
		]
	},
	plugins: [
		new DefinePlugin({
			PACKAGE_VERSION: JSON.stringify(pkg.version),
			PACKAGE_NAME: JSON.stringify(pkg.pkgName),
			FC_EVENT_SOURCE: JSON.stringify('app')
		}),
		new MiniCssExtractPlugin({
			filename: 'style.[chunkhash:8].css',
			chunkFilename: '[id].css',
			ignoreOrder: false
		}),
		new HtmlWebpackPlugin({
			title: 'Zextras Shell',
			inject: true,
			meta: {
				viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
				'x-ua-compatible': { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' }
			}
		}),
		new HtmlWebpackPlugin({
				inject: false,
				template: path.resolve(
					process.cwd(),
					'zimlet_def.template.xml'
				),
				filename: `${pkg.pkgName}.xml`,
				PACKAGE_VERSION: pkg.version,
				PACKAGE_NAME: pkg.pkgName,
				PACKAGE_LABEL: pkg.pkgLabel,
				PACKAGE_DESCRIPTION: pkg.pkgDescription
			})
	]
}, {
	mode: 'development',
	entry: {
		'shell-sw': path.resolve(process.cwd(), 'src', 'serviceworker', 'main.ts'),
	},
	devtool: 'inline-source-map',
	output: {
		path: path.resolve(process.cwd(), 'build'),
		filename: '[name].js',
		publicPath: '/'
	},
	target: 'webworker',
	resolve: {
		extensions: ['*', '.js', '.ts']
	},
	module: {
			rules: [
				{
					test: /\.[jt]s$/,
					exclude: /node_modules/,
					loader: require.resolve('babel-loader'),
					options: babelRCServiceworker
				}
			]
	},
	plugins: [
		new DefinePlugin({
			PACKAGE_VERSION: JSON.stringify(pkg.version),
			PACKAGE_NAME: JSON.stringify(pkg.pkgName),
			FC_EVENT_SOURCE: JSON.stringify('serviceworker')
		})
	]
}];
