/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
	esbuild: {
		jsx: 'automatic'
	},
	css: {
		postcss: {}
	},
	test: {
		globals: true,
		environment: 'jsdom',
		environmentOptions: {
			jsdom: {
				resources: 'usable'
			}
		},
		setupFiles: ['./src/vitest-polyfills.ts', './src/vitest-env-setup.ts'],
		css: {
			modules: {
				classNameStrategy: 'non-scoped'
			}
		},
		coverage: {
			enabled: true,
			provider: 'istanbul',
			reporter: ['text', 'cobertura', 'lcov'],
			include: ['src/**/*.{js,ts,tsx,jsx}'],
			exclude: [
				'**/mocks/**',
				'**/(test|mock)*.ts?(x)',
				'**/types/*',
				'**/*.d.ts',
				'**/tests/*',
				'**/__mocks__/**',
				'**/workers/*'
			]
		},
		reporters: ['default', 'junit'],
		outputFile: {
			junit: './junit.xml'
		},
		include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
		exclude: ['node_modules', 'constants/test.ts'],
		clearMocks: true,
		retry: 2,
		testTimeout: 60000,
		pool: 'forks'
	},
	define: {
		BASE_PATH: JSON.stringify(''),
		POSTHOG_API_HOST: JSON.stringify(''),
		POSTHOG_API_KEY: JSON.stringify('')
	}
});
