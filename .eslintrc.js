module.exports = {
	extends: ['./node_modules/@zextras/zapp-configs/rules/prettier'],
	globals: {
		BASE_PATH: 'readonly',
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
