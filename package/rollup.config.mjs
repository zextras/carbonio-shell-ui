/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

import pkg from './package.json' with { type: 'json' };

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.exports['.'].require,
			format: 'cjs',
			interop: 'compat',
			sourcemap: true
		},
		{
			file: pkg.exports['.'].import,
			format: 'esm',
			interop: 'compat',
			sourcemap: true
		}
	],
	plugins: [
		nodeResolve({
			extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx', '.jsx']
		}),
		commonjs(),
		babel({
			babelHelpers: 'runtime',
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			ignore: ['node_modules']
		})
	],
	external: ['react']
};
