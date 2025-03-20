/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
module.exports = (api) => {
	api.cache(true);
	return {
		presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
		plugins: ['@babel/plugin-transform-runtime']
	};
};
