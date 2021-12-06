// SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

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
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			presets: ['@babel/preset-react', '@babel/preset-typescript'],
			plugins: ['@babel/plugin-proposal-class-properties', 'babel-plugin-styled-components'],
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
		'styled-components'
	]
};
