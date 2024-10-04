/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { act, renderHook } from '@testing-library/react';

import { useIsCarbonioCE } from './hooks';
import { type LoginConfigStore, useLoginConfigStore } from './store';
import { screen, setup } from '../../tests/utils';

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

	it('should return the updated value if the store value change', () => {
		const TestComponent = (): React.JSX.Element => {
			const isCarbonioCE = useIsCarbonioCE();
			return <div>{`isCarbonioCE: ${isCarbonioCE}`}</div>;
		};

		setup(<TestComponent />);
		expect(screen.getByText('isCarbonioCE: undefined')).toBeVisible();
		act(() => {
			useLoginConfigStore.setState({ isCarbonioCE: false });
		});
		expect(screen.getByText('isCarbonioCE: false')).toBeVisible();
		act(() => {
			useLoginConfigStore.setState({ isCarbonioCE: true });
		});
		expect(screen.getByText('isCarbonioCE: true')).toBeVisible();
	});
});
