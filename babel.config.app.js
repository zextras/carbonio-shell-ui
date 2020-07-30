module.exports = {
	presets: [
		['@babel/preset-env', {
			modules: false,
			useBuiltIns: 'usage',
			corejs: 3
		}],
		'@babel/preset-react',
		'@babel/preset-typescript'
	],
	plugins: [
		'@babel/plugin-transform-runtime',
		'@babel/plugin-proposal-class-properties',
		'babel-plugin-styled-components',
		'i18next-extract'
	]
};
