/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		// Test environment
		environment: 'jsdom',
		
		// Global variables equivalent to Jest globals
		globals: true,
		
		// Setup files
		setupFiles: ['./src/vitest-polyfills.ts'],
		
		// Coverage configuration
		coverage: {
			provider: 'v8',
			reporter: ['text', 'cobertura', 'lcov'],
			reportsDirectory: 'coverage',
			include: [
				'src/**/*.{js,ts,tsx}',
			],
			exclude: [
				'src/**/mocks/**/*', // exclude msw handlers
				'src/mocks/**/*', // exclude msw handlers
				'**/(test|mock)*.ts(x)?', // exclude file which name starts with test or mock
				'src/**/types/*', // exclude types
				'src/**/*.d.ts', // exclude declarations
				'src/tests/*', // exclude test folder
				'**/__mocks__/**/*', // exclude manual mocks
				'src/workers/*' // FIXME: exclude worker folder which throws error because of the esm syntax
			]
		},
		
		// Test timeout
		testTimeout: 10000,
		
		// Test patterns
		include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
		exclude: ['/node_modules/', 'constants/test.ts'],
		
		// Mock configuration
		restoreMocks: true,
		
		// Retry configuration
		retry: 2
	},
	
	// Define globals for compatibility
	define: {
		BASE_PATH: '""',
		POSTHOG_API_HOST: '""',
		POSTHOG_API_KEY: '""'
	}
});