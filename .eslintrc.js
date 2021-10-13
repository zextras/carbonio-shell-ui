module.exports = {
	extends: ['./node_modules/@zextras/zapp-configs/rules/eslint'],
	globals: {
		WATCH_SERVER: 'readonly',
		BASE_PATH: 'readonly',
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
