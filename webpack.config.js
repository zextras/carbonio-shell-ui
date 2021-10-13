/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();
const pkg = require('./package.json');

const babelRC = require('./babel.config');
// const babelRCServiceworker = require('./babel.config.serviceworker.js');

const basePath = `/static/iris/carbonio-shell/${commitHash}/`;

const server = require('./.dev.json');

console.log('Building Shell using base path: ');
console.log(` ${basePath} `);
/**
 * The flavor of the build
 * @type {'npm' | 'app'}
 */
const flavor = process.env.ZX_SHELL_FLAVOR || 'APP';

let indexFile;
const pathsToCopy = [
	{
		from: 'node_modules/@zextras/zapp-ui/dist/tinymce/skins',
		to: 'tinymce/skins/'
	}
];
switch (flavor.toUpperCase()) {
	case 'NPM':
		indexFile = path.resolve(process.cwd(), 'src', 'index-npm.tsx');
		pathsToCopy.push({ from: 'translations', to: 'shelli18n' });
		pathsToCopy.push({
			from: 'src/mockServiceWorker.js',
			to: 'mockServiceWorker.js'
		});
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
	devtool: server ? 'eval' : 'source-map',
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: flavor.toUpperCase() !== 'APP' ? '[name].js' : '[name].[chunkhash:8].js',
		chunkFilename: '[name].[chunkhash:8].chunk.js',
		publicPath: basePath
	},
	target: 'web',
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
		alias: {}
	},
	devServer: {
		client: {
			overlay: false
		},
		port: 9000,
		compress: true,
		allowedHosts: 'all',
		https: true,
		open: [basePath],
		proxy: [
			{
				context: ['/service/**', `/static/**`, '!/static/login', `!/static/iris/carbonio-shell`],
				target: `https://${server.host}/`,
				secure: false,
				logLevel: 'debug'
			},
			{
				context: [`${basePath}i18n/**`],
				target: 'https://localhost:9000/',
				pathRewrite: { [`${basePath}i18n/`]: '/shelli18n/' },
				secure: false
			}
		]
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
				exclude: [/node_modules\/tinymce/],
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {}
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
				include: [/src/],
				use: [
					{
						loader: require.resolve('file-loader'),
						options: {}
					}
				]
			}
		]
	},
	plugins: [
		new CopyPlugin({
			patterns: pathsToCopy
		}),
		new DefinePlugin({
			WATCH_SERVER: JSON.stringify(server),
			COMMIT_ID: JSON.stringify(commitHash.toString().trim()),
			PACKAGE_VERSION: JSON.stringify(pkg.version),
			PACKAGE_NAME: JSON.stringify(pkg.zapp.name),
			FLAVOR: JSON.stringify(flavor.toUpperCase()),
			BASE_PATH: JSON.stringify(basePath)
		}),
		new MiniCssExtractPlugin({
			filename: 'style.[chunkhash:8].css',
			chunkFilename: '[id].css',
			ignoreOrder: false
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(process.cwd(), 'src', 'index.template.html'),
			chunks: ['index'],
			BASE_PATH: basePath
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: path.resolve(process.cwd(), 'commit.template'),
			filename: 'commit',
			COMMIT_ID: commitHash
		})
	]
};
