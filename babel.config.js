/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
				useBuiltIns: 'usage',
				corejs: 3.31
			}
		],
		[
			'@babel/preset-react',
			{
				runtime: 'automatic'
			}
		],
		'@babel/preset-typescript'
	],
	plugins: ['babel-plugin-styled-components']
};
