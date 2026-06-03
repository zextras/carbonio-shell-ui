/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, renderHook } from '@testing-library/react';

import { useAppStore } from './store';

describe('store', () => {
	describe('upsertApp', () => {
		it('should add a new app if it does not exist', () => {
			const { result } = renderHook(() => useAppStore());
			act(() => {
				result.current.upsertApp({ name: 'newApp', display: 'New App' });
			});

			expect(
				result.current.apps.newApp,
				'upsertApp should add the new app to the store when it does not exist'
			).toEqual({ name: 'newApp', display: 'New App' });
		});

		it('should update an existing app if it exists', () => {
			const { result } = renderHook(() => useAppStore());
			act(() => {
				result.current.upsertApp({ name: 'app', display: 'App' });
				result.current.upsertApp({ name: 'app', display: 'Updated App' });
			});
			expect(
				result.current.apps.app,
				'upsertApp should no longer hold the original app values after an update'
			).not.toEqual({
				name: 'app',
				display: 'App'
			});
			expect(
				result.current.apps.app,
				'upsertApp should overwrite the existing app with the updated values'
			).toEqual({
				name: 'app',
				display: 'Updated App'
			});
		});
	});
});
