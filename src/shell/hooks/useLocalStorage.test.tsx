/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useState } from 'react';

import { screen, within } from '@testing-library/react';

import { exportForTest, useLocalStorage } from './useLocalStorage';
import { setup } from '../../test/utils';

describe('use local storage', () => {
	const TestComponent = <T,>({
		initialValue,
		updatedValue,
		localStorageKey = 'test-key'
	}: {
		initialValue: T;
		updatedValue: React.SetStateAction<T>;
		localStorageKey?: string;
	}): JSX.Element => {
		const [localStorageValue, setLocalStorageValue] = useLocalStorage(
			localStorageKey,
			initialValue
		);
		const localStorageStoreValue = exportForTest.useLocalStorageStore?.(
			(state) => state.storage[localStorageKey]
		);
		const [localStorageUpdates, setLocalStorageUpdates] = useState<unknown[]>([]);
		const [localStorageStoreUpdates, setLocalStorageStoreUpdates] = useState<unknown[]>([]);

		useEffect(() => {
			setLocalStorageUpdates((prevState) => [...prevState, localStorageValue]);
		}, [localStorageValue]);

		useEffect(() => {
			setLocalStorageStoreUpdates((prevState) => [...prevState, localStorageStoreValue]);
		}, [localStorageStoreValue]);

		const setValueOnClick = useCallback((): void => {
			setLocalStorageValue(updatedValue);
		}, [setLocalStorageValue, updatedValue]);

		return (
			<>
				<span>LocalStorageValue: {JSON.stringify(localStorageValue)}</span>
				<span>LocalStorageValueUpdates: {JSON.stringify(localStorageUpdates)}</span>
				<span>LocalStorageStoreValue: {JSON.stringify(localStorageStoreValue)}</span>
				<span>LocalStorageStoreValueUpdates: {JSON.stringify(localStorageStoreUpdates)}</span>
				<button onClick={setValueOnClick}>Update value</button>
			</>
		);
	};

	test('should show localStorage value and store value', () => {
		const initial = 'initial';
		const updated = 'updated';
		const updatesLocalStorage = [initial];
		const updatesLocalStorageStore = [undefined, initial];
		setup(<TestComponent initialValue={initial} updatedValue={updated} />);
		expect(screen.getByText(`LocalStorageValue: ${JSON.stringify(initial)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage)}`)
		).toBeVisible();
		expect(screen.getByText(`LocalStorageStoreValue: ${JSON.stringify(initial)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`)
		).toBeVisible();
		expect(screen.queryByText(RegExp(updated, 'i'))).not.toBeInTheDocument();
	});

	test('should set the new value in the store when set is called with the new value', async () => {
		const initial = 'initial';
		const updated = 'updated';
		const updatesLocalStorage = [initial, updated];
		const updatesLocalStorageStore = [undefined, initial, updated];
		const { user } = setup(<TestComponent initialValue={initial} updatedValue={updated} />);
		await user.click(screen.getByRole('button'));
		expect(screen.getByText(`LocalStorageValue: ${JSON.stringify(updated)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage)}`)
		).toBeVisible();
		expect(screen.getByText(`LocalStorageStoreValue: ${JSON.stringify(updated)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`)
		).toBeVisible();
	});

	test('should set the new value in the store when set is called with the callback', async () => {
		const initial = 'initial';
		const updated = 'updated';
		const updatesLocalStorage = [initial, updated];
		const updatesLocalStorageStore = [undefined, initial, updated];
		const updateFn = (): string => updated;
		const { user } = setup(<TestComponent initialValue={initial} updatedValue={updateFn} />);
		await user.click(screen.getByRole('button'));
		expect(screen.getByText(`LocalStorageValue: ${JSON.stringify(updated)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage)}`)
		).toBeVisible();
		expect(screen.getByText(`LocalStorageStoreValue: ${JSON.stringify(updated)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`)
		).toBeVisible();
	});

	test('should propagate update of local storage value across different usages of hook', async () => {
		const initial1 = 'initial1';
		const initial2 = 'initial2';
		const updated1 = 'updated1';
		const updated2 = 'updated2';
		const updatesLocalStorage1 = [initial1, updated2];
		const updatesLocalStorageStore = [undefined, initial1, updated2];
		const updatesLocalStorage2 = [initial2, initial1, updated2];
		const { user } = setup(
			<>
				<div data-testid={'block-1'}>
					<TestComponent initialValue={initial1} updatedValue={updated1} />
				</div>
				<div data-testid={'block-2'}>
					<TestComponent initialValue={initial2} updatedValue={updated2} />
				</div>
			</>
		);
		const withinBlock1 = within(screen.getByTestId('block-1'));
		const withinBlock2 = within(screen.getByTestId('block-2'));
		expect(withinBlock1.getByText(`LocalStorageValue: ${JSON.stringify(initial1)}`)).toBeVisible();
		expect(
			withinBlock1.getByText(`LocalStorageStoreValue: ${JSON.stringify(initial1)}`)
		).toBeVisible();
		expect(withinBlock2.getByText(`LocalStorageValue: ${JSON.stringify(initial1)}`)).toBeVisible();
		expect(
			withinBlock2.getByText(`LocalStorageStoreValue: ${JSON.stringify(initial1)}`)
		).toBeVisible();

		await user.click(withinBlock2.getByRole('button'));
		expect(withinBlock1.getByText(`LocalStorageValue: ${JSON.stringify(updated2)}`)).toBeVisible();
		expect(
			withinBlock1.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage1)}`)
		).toBeVisible();
		expect(
			withinBlock1.getByText(`LocalStorageStoreValue: ${JSON.stringify(updated2)}`)
		).toBeVisible();
		expect(
			withinBlock1.getByText(
				`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`
			)
		).toBeVisible();
		expect(withinBlock2.getByText(`LocalStorageValue: ${JSON.stringify(updated2)}`)).toBeVisible();
		expect(
			withinBlock2.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage2)}`)
		).toBeVisible();
		expect(
			withinBlock2.getByText(`LocalStorageStoreValue: ${JSON.stringify(updated2)}`)
		).toBeVisible();
		expect(
			withinBlock2.getByText(
				`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`
			)
		).toBeVisible();
	});

	test('should show the fallback value if the value inside the local storage cannot be parsed', async () => {
		const lsKey = 'test-key';
		window.localStorage.setItem(lsKey, 'not a JSON');
		const initial = 'initial';
		const updatesLocalStorage = [initial];
		const updatesLocalStorageStore = [undefined, initial];
		const actualConsoleError = console.error;
		console.error = jest.fn<ReturnType<typeof console.error>, Parameters<typeof console.error>>(
			(error, ...rest) => {
				if (
					error instanceof Error &&
					error.message === 'Unexpected token o in JSON at position 1'
				) {
					console.log('Controlled error', error, ...rest);
				} else {
					actualConsoleError(error, ...rest);
				}
			}
		);
		setup(
			<TestComponent initialValue={initial} updatedValue={'updated'} localStorageKey={lsKey} />
		);
		expect(screen.getByText(`LocalStorageValue: ${JSON.stringify(initial)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageValueUpdates: ${JSON.stringify(updatesLocalStorage)}`)
		).toBeVisible();
		expect(screen.getByText(`LocalStorageStoreValue: ${JSON.stringify(initial)}`)).toBeVisible();
		expect(
			screen.getByText(`LocalStorageStoreValueUpdates: ${JSON.stringify(updatesLocalStorageStore)}`)
		).toBeVisible();
	});
});
