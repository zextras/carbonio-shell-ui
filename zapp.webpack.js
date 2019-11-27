/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const _ = require('lodash');

module.exports = function (wpConf, zappConfig, options) {
	wpConf.entry = {
		index: path.resolve(process.cwd(), 'src', 'index.ts')
	};
	wpConf.plugins.push(
		new WorkboxPlugin.InjectManifest({
			importWorkboxFrom: 'local',
			swSrc: path.resolve(process.cwd(), 'src', 'serviceworker', 'main.js'),
			swDest: 'service-worker.js'
		})
	);
	wpConf.plugins.push(
		new HtmlWebpackPlugin({
			title: 'Zextras Shell',
			inject: true,
			meta: {
				viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no',
				'x-ua-compatible': { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' }
			}
		})
	);
	wpConf.devServer.port = 9002;
	wpConf.devServer.sockPort = 9002;
	/*
	wpConf.devServer.proxy['/zx/zimlet/com_zextras_theme_default/'] = {
		target: 'http://localhost:9001',
		pathRewrite: { '^/zx/zimlet/com_zextras_theme_default/': '/' }
	};
	*/
	wpConf.resolve.alias = {
		...wpConf.resolve.alias,
		'react-dom': '@hot-loader/react-dom'
	};
	wpConf.devServer.proxy = _.filter(
		wpConf.devServer.proxy,
		function(pr) {
			if (typeof pr.context === 'undefined' || pr.context.length < 1) return true;
			return pr.context[0] !== '/service/soap/**';
		}
	);
	wpConf.devServer.proxy.push({
		context: ['/service/soap/**'],
		target: options.server === 'none' ? `http://localhost:${wpConf.devServer.port}` : `https://${options.server}`,
		secure: false
	});
	wpConf.devServer.proxy = _.filter(
		wpConf.devServer.proxy,
		function(pr) {
			if (typeof pr.context === 'undefined' || pr.context.length < 1 ) return true;
			return pr.context[0] !== `/zx/zimlet/${zappConfig.pkgName}/**`;
		}
	);
	wpConf.devServer.proxy.push({
		context: ['/zx/zimlet/**', `!/zx/zimlet/${zappConfig.pkgName}/**`],
		// context: ['/zx/zimlet/**', `!/zx/zimlet/${zappConfig.pkgName}/**`, '!/zx/zimlet/com_zextras_zapp_todo_list/**'],
		target: options.server === 'none' ? `http://localhost:${wpConf.devServer.port}` : `https://${options.server}`,
		pathRewrite: { '^/zx/zimlet/': '/service/zimlet/' },
		secure: false
	});
	// wpConf.devServer.proxy.push({
	// 	context: ['/zx/zimlet/com_zextras_zapp_todo_list/**'],
	// 	target: 'http://localhost:9000',
	// 	pathRewrite: {
	// 		'^/zx/zimlet/com_zextras_zapp_todo_list/app.*.js': '/app.bundle.js',
	// 		'^/zx/zimlet/com_zextras_zapp_todo_list/style.*.css': '/style.bundle.css'
	// 	},
	// 	secure: false
	// });
	wpConf.devServer.proxy = _.filter(
		wpConf.devServer.proxy,
		function(pr) {
			if (typeof pr.context === 'undefined' || pr.context.length < 1) return true;
			return pr.context[0] !== '/service/soap/GetInfoRequest';
		}
	);
};
