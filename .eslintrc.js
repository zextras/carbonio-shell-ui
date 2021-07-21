module.exports = {
	extends: ['./node_modules/@zextras/zapp-cli/rules'],
	globals: {
		COMMIT_ID: 'readonly',
		FLAVOR: 'readonly',
		PACKAGE_NAME: 'readonly',
		PACKAGE_VERSION: 'readonly',
		cliSettings: 'readonly'
	}
};
