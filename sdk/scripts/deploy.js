/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable no-console */
const arg = require('arg');
const { execSync, spawn } = require('child_process');
const chalk = require('chalk');
const { runBuild } = require('./build');
const { pkg } = require('./utils/pkg');
const { buildSetup } = require('./utils/setup');

const ENTRY_REGEX = /^app\..*\.js$/;
function parseArguments() {
	const args = arg(
		{
			'--host': String,
			'-h': '--host',
			'--user': String,
			'-u': '--user'
		},
		{
			argv: process.argv.slice(2),
			permissive: true
		}
	);
	return {
		host: args['--host'],
		user: args['--user'] || 'root'
	};
}

const updateJson = (jsonObject, stats) => {
	const components = jsonObject.components.filter((component) => component.name !== pkg.zapp.name);

	components.push({
		name: pkg.zapp.name,
		commit: buildSetup.commitHash,
		display: pkg.zapp.display,
		route: pkg.zapp.route,
		description: pkg.description,
		version: pkg.version,
		priority: pkg.zapp.priority,
		js_entrypoint:
			buildSetup.basePath + Object.keys(stats.compilation.assets).find((p) => ENTRY_REGEX.test(p))
	});
	return { components };
};
exports.runDeploy = async () => {
	const options = parseArguments();
	const stats = await runBuild();
	if (options.host) {
		const target = `${options.user}@${options.host}`;
		console.log('- Deploying to the carbonio podman container...');
		execSync(
			`ssh ${target} "cd /opt/zextras/web/iris/ && rm -rf ${pkg.zapp.name}/* && mkdir -p ${pkg.zapp.name}/${buildSetup.commitHash}"`
		);
		execSync(
			`scp -r dist/* ${target}:/opt/zextras/web/iris/${pkg.zapp.name}/${buildSetup.commitHash}`
		);
		console.log('- Updating components.json...');
		const components = JSON.stringify(
			updateJson(
				JSON.parse(execSync(`ssh ${target} cat /opt/zextras/web/iris/components.json`).toString()),
				stats
			)
		).replace(/"/g, '\\"');
		execSync(`ssh ${target} "echo '${components}' > /opt/zextras/web/iris/components.json"`);
		console.log(chalk.bgBlue.white.bold('Deploy Completed'));
	} else {
		console.log(chalk.bgYellow.white('Target host not specified, skippind deploy step'));
	}
};
