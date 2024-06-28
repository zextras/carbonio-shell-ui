/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { execSync } from 'child_process';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { ContextReplacementPlugin, DefinePlugin } from 'webpack';
import type { WebpackConfiguration } from 'webpack-cli';

import { SUPPORTED_LOCALES } from './src/constants/locales';

const commitHash = execSync('git rev-parse HEAD').toString().trim();

const baseStaticPath = `/static/iris/carbonio-shell-ui/${commitHash}/`;

const supportedLocalesList = Object.values(SUPPORTED_LOCALES);

// these have to match with the ones available in date-fns/locale
const supportedLocalesDateFns = supportedLocalesList.map(
	(locale) => ('dateFnsLocale' in locale && locale.dateFnsLocale) || locale.value
);
const tinymceLocales = supportedLocalesList.map(
	(locale) => ('tinymceLocale' in locale && locale.tinymceLocale) || locale.value
);

const configFn = (
	initialConf: WebpackConfiguration,
	pkg: string,
	options: { host: string; port: number },
	mode: 'development' | 'production'
): WebpackConfiguration => {
	const conf: WebpackConfiguration = { ...initialConf };
	const server = `https://${options.host}`;
	const root = 'carbonio';
	conf.entry = {
		index: path.resolve(process.cwd(), 'src', 'index.tsx')
	};
	conf.output = {
		...conf.output,
		filename: mode === 'development' ? 'zapp-shell.bundle.js' : '[name].[chunkhash:8].js'
	};
	const extensions = conf.resolve?.extensions ?? [];
	extensions.push('.d.ts');
	conf.resolve = {
		...conf.resolve,
		extensions,
		alias: {
			...conf.resolve?.alias,
			'react/jsx-runtime': 'react/jsx-runtime.js'
		}
	};
	conf.plugins = conf.plugins ?? [];
	conf.plugins.push(
		new CopyPlugin({
			patterns: [
				{
					from: 'assets/',
					to: ''
				},
				{
					from: `plugins/help/js/i18n/**/(${tinymceLocales.join('|')}).js`,
					to: '',
					context: 'node_modules/tinymce/'
				}
			]
		}),
		new DefinePlugin({
			COMMIT_ID: JSON.stringify(commitHash.toString().trim()),
			BASE_PATH: JSON.stringify(baseStaticPath)
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(process.cwd(), 'src', 'index.template.html'),
			chunks: ['index'],
			BASE_PATH: baseStaticPath
		}),
		new HtmlWebpackPlugin({
			inject: false,
			template: path.resolve(process.cwd(), 'commit.template'),
			filename: 'commit',
			COMMIT_ID: commitHash
		}),
		new ContextReplacementPlugin(
			/^date-fns[/\\]locale$/,
			new RegExp(`\\.[/\\\\](${supportedLocalesDateFns.join('|')})[/\\\\]index\\.js$`)
		)
	);
	conf.devServer = {
		port: options.port,
		historyApiFallback: {
			index: `${baseStaticPath}/index.html`,
			rewrites: [
				{
					from: new RegExp(`/${root}/*`),
					to: `${baseStaticPath}/index.html`
				}
			]
		},
		server: 'https',
		open: [`/${root}/`],
		proxy: [
			{
				context: ['/static/login/**'],
				target: server,
				secure: false,
				cookieDomainRewrite: {
					'*': server,
					[server]: `localhost:${options.port}`
				}
			},
			{
				context: ['!/static/iris/carbonio-shell-ui/**/*', `!/${root}/`, `!/${root}/**/*`],
				target: server,
				secure: false,
				logLevel: 'debug',
				cookieDomainRewrite: {
					'*': server,
					[server]: `localhost:${options.port}`
				}
			}
		]
	};
	conf.externals = {};
	const rules: NonNullable<WebpackConfiguration['module']>['rules'] = conf.module?.rules ?? [];
	rules.push({
		test: /\.(woff(2)?|ttf|eot)$/,
		type: 'asset/resource',
		generator: {
			filename: './files/[name][ext]'
		}
	});
	conf.module = {
		...conf.module,
		rules
	};
	return conf;
};

export = configFn;
