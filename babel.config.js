module.exports = function (api) {
	const isTest = api ? api.env('test') : false;

	return {
		presets: [
			[
				'@babel/preset-env',
				isTest
					? {
							targets: {
								node: 'current'
							}
					  }
					: {
							modules: false,
							useBuiltIns: 'usage',
							corejs: 3
					  }
			],
			'@babel/preset-react',
			'@babel/preset-typescript'
		],
		plugins: [
			'@babel/plugin-transform-runtime',
			'@babel/plugin-proposal-class-properties',
			'babel-plugin-styled-components',
			[
				'i18next-extract',
				{
					outputPath: 'translations/{{ns}}.json',
					discardOldKeys: true,
					defaultNS: 'en',
					jsonSpace: 4
				}
			]
		]
	};
};
