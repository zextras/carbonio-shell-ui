/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const commitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim();

const baseStaticPath = `/static/iris/carbonio-shell-ui/${commitHash}/`;

module.exports = (conf, pkg, options, mode) => {
	const server = `https://${options.host}`;
	conf.entry = {
		index: path.resolve(process.cwd(), 'src', 'index.tsx')
	};
	conf.module.rules.unshift({
		test: /\.svg$/,
		use: ['@svgr/webpack']
	});
	conf.output.filename =
		mode === 'development' ? 'zapp-shell.bundle.js' : '[name].[chunkhash:8].js';
	conf.resolve.extensions.push('.d.ts');
	conf.plugins.push(
		new CopyPlugin({
			patterns: [
				{
					from: 'node_modules/@zextras/carbonio-design-system/dist/tinymce/skins',
					to: 'tinymce/skins/'
				},
				{
					from: 'assets/',
					to: ''
				}
			]
		}),
		new DefinePlugin({
			WATCH_SERVER: JSON.stringify(server),
			COMMIT_ID: JSON.stringify(commitHash.toString().trim()),
			PACKAGE_VERSION: JSON.stringify(pkg.version),
			PACKAGE_NAME: JSON.stringify(pkg.carbonio.name),
			BASE_PATH: JSON.stringify(baseStaticPath)
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
		})
	);
	conf.devServer = {
		port: 9000,
		historyApiFallback: {
			index: `${baseStaticPath}/index.html`,
			rewrites: [
				// eslint-disable-next-line no-nested-ternary
				options.admin
					? {
							from: /\/carbonioAdmin\/*/,
							to: `${baseStaticPath}/index.html`
					  }
					: options.standalone
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
		server: 'https',
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
	};
	return conf;
};
