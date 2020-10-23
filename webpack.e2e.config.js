const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
	entry: {
		'app.bundle': path.resolve(process.cwd(), 'e2e', 'src', 'app-wrapper.js')
	},
	externals: {
		// dexie: '__ZAPP_SHARED_LIBRARIES__[\'dexie\']',
		// react: '__ZAPP_SHARED_LIBRARIES__[\'react\']',
		// 'react-dom': '__ZAPP_SHARED_LIBRARIES__[\'react-dom\']',
		// lodash: '__ZAPP_SHARED_LIBRARIES__[\'lodash\']',
		// rxjs: '__ZAPP_SHARED_LIBRARIES__[\'rxjs\']',
		// 'rxjs/operators': '__ZAPP_SHARED_LIBRARIES__[\'rxjs/operators\']',
		// 'react-redux': '__ZAPP_SHARED_LIBRARIES__[\'react-redux\']',
		// 'react-router-dom': '__ZAPP_SHARED_LIBRARIES__[\'react-router-dom\']',
		// 'styled-components': '__ZAPP_SHARED_LIBRARIES__[\'styled-components\']',
		// 'prop-types': '__ZAPP_SHARED_LIBRARIES__[\'prop-types\']',
		// moment: '__ZAPP_SHARED_LIBRARIES__[\'moment\']',
		// '@reduxjs/toolkit': '__ZAPP_SHARED_LIBRARIES__[\'@reduxjs/toolkit\']',
		'@zextras/zapp-shell': '__ZAPP_SHARED_LIBRARIES__[\'@zextras/zapp-shell\']',
		// '@zextras/zapp-ui': '__ZAPP_SHARED_LIBRARIES__[\'@zextras/zapp-ui\']'
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'e2e/src/translations', to: 'i18n' },
			],
		})
	],
	devServer: {
		historyApiFallback: true,
		before: function (app, server) {
			app.get('/_cli', function (req, res) {
				res.json({
					server: undefined,
					app_package: {
						package: 'com_example_awesome_app',
						name: 'com_example_awesome_app',
						label: 'My Awesome App',
						version: '0.0.0',
						description: 'An awesome app to test the shell.',
						type: 'app'
					}
				});
			});
		},
		proxy: [
			{
				context: ['/zx/zimlet/com_zextras_zapp_shell/**', '!/zx/zimlet/com_zextras_zapp_shell/i18n/**'],
				target: 'http://localhost:8080',
				pathRewrite: { ['^/zx/zimlet/com_zextras_zapp_shell']: ''}
			},
			{
				context: [`/zx/zimlet/com_zextras_zapp_shell/i18n/**`],
				target: `http://localhost:8080`,
				pathRewrite: { [`^/zx/zimlet/com_zextras_zapp_shell/i18n/`]: '/shelli18n/' },
			},
			{
				context: ['/zx/zimlet/com_example_awesome_app/**'],
				target: 'http://localhost:8080',
				pathRewrite: { ['^/zx/zimlet/com_example_awesome_app'] : ''}
			},
		],
	},
});
