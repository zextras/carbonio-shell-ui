/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
	input: 'src/jest-mocks.jsx',
	output: {
		file: 'dist/zapp-shell.bundle.js',
		format: 'cjs'
	},
	plugins: [
		nodeResolve({
			extensions: ['.js', '.jsx', '.ts', '.tsx']
		}),
		commonjs(),
		babel({
			babelHelpers: 'runtime',
			presets: [
				'@babel/preset-react',
				'@babel/preset-typescript'
			],
			plugins: [
				'@babel/plugin-proposal-class-properties',
				'babel-plugin-styled-components'
			],
			ignore: ['node_modules']
		})
	],
	external: [
		'@reduxjs/toolkit',
		'@testing-library/jest-dom',
		'@testing-library/react',
		'@testing-library/react-hooks',
		'@testing-library/user-event',
		'@zextras/zapp-ui',
		'react-router-dom',
		'core-js',
		'moment',
		'msw',
		'node-fetch',
		'prop-types',
		'path',
		'react',
		'react-dom',
		'react-i18next',
		'react-redux',
		'rxjs',
		'styled-components'
	]
};
