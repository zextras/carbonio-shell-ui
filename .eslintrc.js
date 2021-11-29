// SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: CC0-1.0

module.exports = {
	extends: ['./node_modules/@zextras/zapp-configs/rules/eslint'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx']
			}
		}
	},
	globals: {
		WATCH_SERVER: 'readonly',
		BASE_PATH: 'readonly',
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
