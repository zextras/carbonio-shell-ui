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

const server = `https://${process.env.PROXY_SERVER}/`;
console.log(`Building Shell in ${process.argv.mode} using base path: `);
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
	mode: server || flavor.toUpperCase() !== 'APP' ? 'development' : 'production',
	entry: {
		index: indexFile
	},
	devtool: 'source-map',
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
		// client: {
		// 	overlay: false
		// },
		port: 9000,
		historyApiFallback: true,
		// compress: true,
		// allowedHosts: 'all',
		https: true,
		open: ['/static/login', basePath],
		proxy: [
			{
				context: ['/static/login/**'],
				target: server,
				changeOrigin: true,
				autoRewrite: true,
				cookieDomainRewrite: {
					//	[server]: 'localhost:9000'
					'*': server
				}
			},
			{
				context: ['**', '!/static/iris/carbonio-shell/**'],
				target: server,
				ws: true,
				secure: false,
				// changeOrigin: true,
				// autoRewrite: true,
				// logLevel: 'debug',
				cookieDomainRewrite: {
					[server]: 'localhost:9000'
				}
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
