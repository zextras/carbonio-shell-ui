/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();

const babelRC = require('./babel.config');

const baseStaticPath = `/static/iris/carbonio-shell-ui/${commitHash}/`;

const pathsToCopy = [
	{
		from: 'node_modules/@zextras/carbonio-design-system/dist/tinymce/skins',
		to: 'tinymce/skins/'
	},
	{
		from: 'assets/',
		to: ''
	},
	{
		from: 'translations',
		to: 'i18n'
	}
];

module.exports = (_, pkg, options, mode) => {
	const server = `https://${options.host}`;
	return {
		mode,
		entry: {
			index: path.resolve(process.cwd(), 'src', 'index.tsx')
		},
		devtool: 'source-map',
		output: {
			path: path.resolve(process.cwd(), 'dist'),
			filename: mode === 'development' ? 'zapp-shell.bundle.js' : '[name].[chunkhash:8].js',
			chunkFilename: '[name].[chunkhash:8].chunk.js',
			publicPath: baseStaticPath
		},
		target: 'web',
		resolve: {
			extensions: ['*', '.js', '.jsx', '.ts', '.tsx', '.d.ts'],
			alias: {}
		},
		devServer: {
			port: 9000,
			historyApiFallback: {
				index: `${baseStaticPath}/index.html`,
				rewrites: [
					// eslint-disable-next-line no-nested-ternary
					options.type === 'carbonioAdmin'
						? {
								from: /\/carbonioAdmin\/*/,
								to: `${baseStaticPath}/admin.html`
						  }
						: options.type === 'carbonioStandalone'
						? {
								from: /\/carbonioStandalone\/*/,
								to: `${baseStaticPath}/standalone.html`
						  }
						: {
								from: /\/carbonio\/*/,
								to: `${baseStaticPath}/index.html`
						  }
				]
			},
			https: true,
			open: [`/${options.type || 'carbonio'}/`],
			proxy: [
				{
					context: ['/static/login/**'],
					target: server,
					secure: false,
					cookieDomainRewrite: {
						'*': server,
						[server]: 'localhost:9000'
					}
				},
				{
					context: [
						'!/static/iris/carbonio-shell-ui/**/*',
						`!/${options.watchType || 'carbonio'}/`,
						`!/${options.watchType || 'carbonio'}/**/*`
					],
					target: server,
					secure: false,
					logLevel: 'debug',
					cookieDomainRewrite: {
						'*': server,
						[server]: 'localhost:9000'
					}
				},
				{
					context: ['/carbonioAdmin/**/*'],
					target: `https://localhost:9000/${baseStaticPath}/admin.html`,
					secure: false,
					logLevel: 'debug',
					cookieDomainRewrite: {
						'*': server,
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
					options: babelRC
				},
				{
					test: /\.(css)$/,
					// exclude: [/node_modules\/tinymce/],
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
					test: /\.svg$/,
					use: ['@svgr/webpack']
				},
				{
					test: /\.(png|jpg|gif|woff2?|eot|ttf|ogg|mp3)$/,
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
			new CircularDependencyPlugin({
				// exclude detection of files based on a RegExp
				exclude: /node_modules/,
				// add errors to webpack instead of warnings
				failOnError: false,
				// allow import cycles that include an asynchronous import,
				// e.g. via import(/* webpackMode: "weak" */ './file.js')
				allowAsyncCycles: true,
				// set the current working directory for displaying module paths
				cwd: process.cwd()
			}),
			new DefinePlugin({
				WATCH_SERVER: JSON.stringify(server),
				COMMIT_ID: JSON.stringify(commitHash.toString().trim()),
				PACKAGE_VERSION: JSON.stringify(pkg.version),
				PACKAGE_NAME: JSON.stringify(pkg.carbonio.name),
				BASE_PATH: JSON.stringify(baseStaticPath)
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
				BASE_PATH: baseStaticPath,
				SHELL_ENV: options.type
			}),
			new HtmlWebpackPlugin({
				inject: false,
				template: path.resolve(process.cwd(), 'commit.template'),
				filename: 'commit',
				COMMIT_ID: commitHash
			}),
			new HtmlWebpackPlugin({
				inject: false,
				template: path.resolve(
					process.cwd(),
					'node_modules/@zextras/carbonio-ui-sdk/scripts/configs/component.template'
				),
				filename: 'component.json',
				name: pkg.carbonio.name,
				description: pkg.description,
				version: pkg.version,
				commit: commitHash,
				priority: pkg.carbonio.priority,
				type: pkg.carbonio.type,
				attrKey: pkg.carbonio.attrKey ?? '',
				icon: pkg.carbonio.icon ?? 'CubeOutline',
				display: pkg.carbonio.display
			}),

			new HtmlWebpackPlugin({
				inject: false,
				template: path.resolve(
					process.cwd(),
					'node_modules/@zextras/carbonio-ui-sdk/scripts/configs/component.template'
				),
				filename: 'component.json',
				name: pkg.carbonio.name,
				description: pkg.description,
				version: pkg.version,
				commit: commitHash,
				priority: pkg.carbonio.priority,
				type: pkg.carbonio.type,
				attrKey: pkg.carbonio.attrKey ?? '',
				icon: pkg.carbonio.icon ?? 'CubeOutline',
				display: pkg.carbonio.display
			})
		]
	};
};
