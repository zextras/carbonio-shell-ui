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
	parserOptions: {
		project: ['tsconfig.json']
	},
	globals: {
		BASE_PATH: 'readonly',
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
		],
		'no-param-reassign': [
			'error',
			{
				props: true,
				ignorePropertyModificationsFor: ['accumulator', 'state', 'event', 'prevState']
			}
		],
		'sonarjs/cognitive-complexity': 'warn',
		// TODO: enable when this will be released https://github.com/SonarSource/eslint-plugin-sonarjs/pull/405
		'sonarjs/no-duplicate-string': 'off',
		'@typescript-eslint/consistent-type-exports': 'error',
		'@typescript-eslint/consistent-type-imports': 'error'
	},
	overrides: [
		{
			// enable eslint-plugin-testing-library rules or preset only for test files
			files: ['**/test/**/*.[jt]s?(x)', '**/mocks/**/*.[jt]s?(x)', '**/jest-*.ts?(x)'],
			extends: ['plugin:jest-dom/recommended', 'plugin:testing-library/react'],
			rules: {
				'testing-library/no-unnecessary-act': 'warn',
				'testing-library/no-global-regexp-flag-in-query': 'error',
				'testing-library/prefer-user-event': 'warn',
				'import/no-extraneous-dependencies': 'off'
			}
		},
		{
			files: ['carbonio.webpack.ts', '*.config.ts'],
			rules: {
				'import/no-extraneous-dependencies': 'off'
			}
		}
	],
	ignorePatterns: ['src/constants/locales.js']
};
