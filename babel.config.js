/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
module.exports = (api) => {
	let presetEnvOptions;
	const plugins = ['@emotion/babel-plugin'];
	if (api.env('test')) {
		presetEnvOptions = {
			modules: 'commonjs'
		};
		plugins.push('babel-plugin-transform-import-meta');
	} else {
		presetEnvOptions = {
			modules: false
		};
	}
	return {
		presets: [
			['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3.49, ...presetEnvOptions }],
			['@babel/preset-react', { runtime: 'automatic' }],
			'@babel/preset-typescript'
		],
		plugins
	};
};
