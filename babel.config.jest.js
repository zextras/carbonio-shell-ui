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
				modules: 'commonjs'
			}
		],
		'@babel/preset-react',
		'@babel/preset-typescript'
	],
	plugins: ['babel-plugin-styled-components', 'babel-plugin-transform-import-meta']
};
