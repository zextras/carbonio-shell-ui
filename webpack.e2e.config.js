const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	devServer: {
		proxy: [
			{
				context: ['/service/**'],
				target: 'https://' + process.env.SERVER,
				secure: false
			}
		]
	},
});
