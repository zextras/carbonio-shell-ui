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
