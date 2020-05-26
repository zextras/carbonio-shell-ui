const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const pkg = require('./zapp.conf.js');

const babelRCApp = require('./babel.config.app.js');
// const babelRCServiceworker = require('./babel.config.serviceworker.js');

/**
 * The flavor of the build
 * @type {'npm' | 'e2e' | 'app'}
 */
const flavor = process.env.ZX_SHELL_FLAVOR || 'APP';

let indexFile;
switch (flavor.toUpperCase()) {
	case 'NPM':
	case 'E2E':
		indexFile = path.resolve(process.cwd(), 'src', 'index-npm.ts');
		break;
	case 'APP':
	default:
		indexFile = path.resolve(process.cwd(), 'src', 'index.ts');
}

module.exports = {
	mode: 'development',
	entry: {
		index: indexFile
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
				options: babelRCApp
			},
			{
				test: /\.(css)$/,
				exclude: [
					/node_modules\/tinymce/,
				],
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
			)
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
	],
	externals: {
		'@zextras/zapp-cli': '__ZAPP_CLI__'
	},
	devServer: {
		historyApiFallback: true,
		proxy: {
			'/zx/zimlet/com_zextras_zapp_shell': {
				target: 'http://localhost:8080',
				pathRewrite: {'^/zx/zimlet/com_zextras_zapp_shell' : ''}
			}
		}
	}
};
/* {
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
			PACKAGE_NAME: JSON.stringify(pkg.pkgName)
		})
	]
} */
