module.exports = {
	extends: ['./node_modules/@zextras/zapp-cli/rules'],
	globals: {
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
