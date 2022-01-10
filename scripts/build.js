/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-console */
const arg = require('arg');
const chalk = require('chalk');
const webpack = require('webpack');
const { buildSetup } = require('./utils/setup');
const { pkg } = require('./utils/pkg');
const { setupWebpackBuildConfig } = require('./configs/webpack.build.config');

function parseArguments() {
	const args = arg(
		{
			'--analyze': Boolean,
			'-a': '--analyze'
		},
		{
			argv: process.argv.slice(2),
			permissive: true
		}
	);
	return {
		analyzeBundle: args['--analyze'] || false
	};
}

const logBuild =
	([resolve, reject]) =>
	(err, stats) => {
		if (err) {
			console.log(chalk.bgRed.white.bold('Webpack Runtime Error'));
			console.error(err.stack || err);
			if (err.details) {
				console.error(err.details);
			}
			reject(err);
		}

		const info = stats.toJson();

		if (stats.hasWarnings()) {
			chalk.bgRed.white.bold(`Webpack Compilations Warning${info.warnings.length > 0 ? 's' : ''}`);
			console.warn(info.warnings);
		}

		if (stats.hasErrors()) {
			console.log(
				chalk.bgRed.white.bold(`Webpack Compilations Error${info.errors.length > 0 ? 's' : ''}`)
			);
			console.error(info.errors);
			reject(err);
		} else {
			console.log(chalk.bgBlue.white.bold('Compiled Successfully!'));
		}
		resolve(stats);
	};

exports.runBuild = () =>
	new Promise((...p) => {
		const options = parseArguments();
		console.log('Building ', chalk.green(pkg.zapp.name));
		console.log('Using base path ', chalk.green(buildSetup.basePath));
		const config = setupWebpackBuildConfig(options, buildSetup);
		const compiler = webpack(config);
		compiler.run(logBuild(p));
	});
