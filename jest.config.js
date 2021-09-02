module.exports = {
	globals: {
		PACKAGE_VERSION: '0.0.0',
		PACKAGE_NAME: 'carbonio-shell',
		FLAVOR: 'NPM'
	},
	transform: {
		'^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.jest.js' }]
	},
	moduleDirectories: [
		'node_modules',
		// add the directory with the test-utils.js file:
		'test/utils', // a utility folder
		'/zapp-ui/'
	],
	clearMocks: true,
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'cobertura'],
	reporters: ['default', 'jest-junit'],
	// testMatch: ['/test/**/*.js?(x)'],
	setupFilesAfterEnv: ['<rootDir>/src/jest-env-setup.js'],
	setupFiles: ['<rootDir>/src/jest-polyfills.js']
};
