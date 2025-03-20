/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { describe, it, expect } from 'vitest';

import { ApiManager } from './ApiManager';

describe('ApiManager', () => {
	it('returns the same instance when getApiManager is called multiple times', () => {
		const instance1 = ApiManager.getApiManager();
		const instance2 = ApiManager.getApiManager();
		expect(instance1).toBe(instance2);
	});

	it('initializes sessionInfo as an empty object', () => {
		const apiManager = new ApiManager();
		expect(apiManager.getSessionInfo()).toEqual({});
	});

	it('creates a new ApiManager instance if none exists', () => {
		delete window.carbonioApiManager;
		const apiManager = ApiManager.getApiManager();
		expect(apiManager).toBeInstanceOf(ApiManager);
	});

	it('does not overwrite existing ApiManager instance', () => {
		const existingInstance = new ApiManager();
		window.carbonioApiManager = existingInstance;
		const apiManager = ApiManager.getApiManager();
		expect(apiManager).toBe(existingInstance);
	});
});
