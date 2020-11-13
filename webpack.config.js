/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('./zapp.conf.js');

const babelRC = require('./babel.config.js');
// const babelRCServiceworker = require('./babel.config.serviceworker.js');

/**
 * The flavor of the build
 * @type {'npm' | 'e2e' | 'app'}
 */
const flavor = process.env.ZX_SHELL_FLAVOR || 'APP';

let indexFile;
const pathsToCopy = [
	{ from: 'assets', to: 'assets' },
	{ from: 'tinymce/skins', to: 'tinymce/skins/' },
];
switch (flavor.toUpperCase()) {
	case 'NPM':
	case 'E2E':
		indexFile = path.resolve(process.cwd(), 'src', 'index-npm.tsx');
		pathsToCopy.push({ from: 'translations', to: 'shelli18n' });
		pathsToCopy.push({ from: 'src/mockServiceWorker.js', to: 'mockServiceWorker.js' });
		break;
	case 'APP':
	default:
		indexFile = path.resolve(process.cwd(), 'src', 'index.tsx');
		pathsToCopy.push({ from: 'translations', to: 'i18n' });
}

module.exports = {
	mode: flavor.toUpperCase() !== 'APP' ? 'development' : 'production',
	entry: {
		index: indexFile
	},
	devtool: 'source-map',
	output: {
		path: path.resolve(process.cwd(), 'dist', 'public'),
		filename: flavor.toUpperCase() !== 'APP' ? '[name].js' : '[name].[chunkhash:8].js',
		chunkFilename: '[name].[chunkhash:8].chunk.js',
		publicPath: '/'
	},
	target: 'web',
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
		alias: {
			'@zextras/zapp-ui': path.resolve(process.cwd(), 'zapp-ui', 'src', 'index'),
		}
	},
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
				options: babelRC()
			},
			{
				test: /\.(css)$/,
				exclude: [
					/node_modules\/tinymce/,
				],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					{
						loader: require.resolve('css-loader'),
						options: {
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
				exclude: /assets/,
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
		new CopyPlugin({
			patterns: pathsToCopy,
		}),
		new DefinePlugin({
			PACKAGE_VERSION: JSON.stringify(pkg.version),
			PACKAGE_NAME: JSON.stringify(pkg.pkgName),
			FLAVOR: JSON.stringify(flavor.toUpperCase())
		}),
		new MiniCssExtractPlugin({
			filename: 'style.[chunkhash:8].css',
			chunkFilename: '[id].css',
			ignoreOrder: false
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(
				process.cwd(),
				'src',
				'index.html'
			),
			chunks: ['index']
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
};
