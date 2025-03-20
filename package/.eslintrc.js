/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require('./node_modules/@zextras/carbonio-ui-configs/rules/eslint-base');

module.exports = {
	...baseConfig,
	plugins: [...baseConfig.plugins, 'notice'],
	rules: {
		...baseConfig.rules,
		'notice/notice': [
			'error',
			{
				templateFile: '.reuse/template.js'
			}
		]
	}
};
