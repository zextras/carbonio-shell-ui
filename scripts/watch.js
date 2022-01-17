/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-console */
const arg = require('arg');
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { buildSetup } = require('./utils/setup');
const { pkg } = require('./utils/pkg');
const { setupWebpackWatchConfig } = require('./configs/webpack.watch.config');

function parseArguments() {
	const args = arg(
		{
			'--host': String,
			'-h': '--host',
			'--standalone': Boolean,
			'-s': '--standalone',
			'--error-reporter': Boolean,
			'-e': '--error-reporter',
			'--use-local-ds': Boolean,
			'-u': '--use-local-ds'
		},
		{
			argv: process.argv.slice(2),
			permissive: true
		}
	);
	return {
		host: args['--host'] || 'localhost:4443',
		standalone: args['--standalone'] || false,
		errorReporter: args['--error-reporter'] || false,
		useLocalDS: args['--error-reporter'] || false
	};
}

exports.runWatch = async () => {
	const options = parseArguments();
	console.log('Building ', chalk.green(pkg.zapp.name));
	console.log('Using base path ', chalk.green(buildSetup.basePath));
	console.log('Paramenters:');
	Object.keys(options).forEach((key) => console.log(chalk.green(`${key}: `), options[key]));
	const config = setupWebpackWatchConfig(options, buildSetup);
	const compiler = webpack(config);
	// const watching = compiler.watch( {}, logBuild );
	const server = new WebpackDevServer(config.devServer, compiler);
	const runServer = async () => {
		console.log(chalk.bgBlue.whiteBright.bold('Starting server...'));
		await server.start();
	};
	runServer();
};
