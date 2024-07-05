/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react-hooks';

import { useIsCarbonioCE } from './hooks';
import { type LoginConfigStore, useLoginConfigStore } from './store';

describe('useIsCarbonioCE hook', () => {
	it('should return undefined when store value is not set', () => {
		const { result } = renderHook(() => useIsCarbonioCE());
		expect(result.current).toBe(undefined);
	});

	it('should return true when store value is true', () => {
		useLoginConfigStore.setState((state: LoginConfigStore) => ({
			...state,
			isCarbonioCE: true
		}));
		const { result } = renderHook(() => useIsCarbonioCE());
		expect(result.current).toBe(true);
	});

	it('should return false when store value is false', () => {
		useLoginConfigStore.setState((state: LoginConfigStore) => ({
			...state,
			isCarbonioCE: false
		}));
		const { result } = renderHook(() => useIsCarbonioCE());
		expect(result.current).toBe(false);
	});
});
