module.exports = {
	extends: ['./node_modules/@zextras/zapp-cli/rules'],
	globals: {
		BASE_PATH: 'readonly',
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
