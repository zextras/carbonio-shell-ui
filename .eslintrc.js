/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

module.exports = {
	extends: ['./node_modules/@zextras/carbonio-ui-configs/rules/eslint'],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx']
			}
		}
	},
	globals: {
		BASE_PATH: 'readonly',
		__SHELL_ENV__: 'readonly',
		__CARBONIO_DEV__: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	},
	plugins: ['notice'],
	rules: {
		'notice/notice': [
			'error',
			{
				templateFile: '.reuse/template.js'
			}
		]
	}
};
