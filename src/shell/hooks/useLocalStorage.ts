/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { create } from 'zustand';

import { createExportForTestOnly } from '../../utils/utils';

function isSameLocalStorageValue(valueA: unknown, valueB: unknown): boolean {
	return JSON.stringify(valueA) === JSON.stringify(valueB);
}

type LocalStorageOptions = { keepSynchedWithStorage?: boolean };

type LocalStorageState = {
	storage: Record<string, unknown>;
	readValue: <T>(key: string, fallback: T) => void;
	setValue: <T>(key: string, value: React.SetStateAction<T>) => void;
};

const useLocalStorageStore = create<LocalStorageState>()((setState) => ({
	storage: {},
	readValue<T>(key: string, fallback: T): void {
		try {
			const localStorageItem = window.localStorage.getItem(key);
			const item = localStorageItem !== null ? JSON.parse(localStorageItem) : fallback;
			setState((state) => {
				if (state.storage[key] === undefined) {
					return { storage: { ...state.storage, [key]: item } };
				}
				return state;
			});
		} catch (error) {
			console.error(error);
			setState((state) => ({ storage: { ...state.storage, [key]: fallback } }));
		}
	},
	setValue<T>(key: string, value: React.SetStateAction<T>): void {
		setState((state) => {
			const valueToStore = value instanceof Function ? value(state.storage[key] as T) : value;
			if (!isSameLocalStorageValue(valueToStore, state.storage[key])) {
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
				return { storage: { ...state.storage, [key]: valueToStore } };
			}
			return state;
		});
	}
}));

const DEFAULT_OPTIONS: LocalStorageOptions = {
	keepSynchedWithStorage: true
};

export function useLocalStorage<T>(
	key: string,
	initialValue: T,
	options = DEFAULT_OPTIONS
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const storedValue = useLocalStorageStore((state) => (state.storage[key] as T) || initialValue);
	const shouldDispatchStorageEventRef = useRef(false);
	const localStorageOptions = useMemo(() => ({ ...DEFAULT_OPTIONS, ...options }), [options]);

	const readValueForKey = useCallback(() => {
		useLocalStorageStore.getState().readValue(key, initialValue);
	}, [key, initialValue]);

	useEffect(() => {
		readValueForKey();
	}, [readValueForKey]);

	const setValueForKey = useCallback<React.Dispatch<React.SetStateAction<T>>>(
		(value) => {
			useLocalStorageStore.getState().setValue(key, value);
			shouldDispatchStorageEventRef.current = true;
		},
		[key]
	);

	useEffect(() => {
		if (localStorageOptions?.keepSynchedWithStorage) {
			window.addEventListener('storage', readValueForKey);
		}

		return (): void => {
			window.removeEventListener('storage', readValueForKey);
		};
	}, [localStorageOptions?.keepSynchedWithStorage, readValueForKey]);

	useEffect(() => {
		if (shouldDispatchStorageEventRef.current) {
			// dispatch event when stored value change,
			// but only after render to avoid possible update of parent component during render
			window.dispatchEvent(new Event('storage'));
			shouldDispatchStorageEventRef.current = false;
		}
	}, [storedValue]);

	return [storedValue, setValueForKey];
}

export const exportForTest = createExportForTestOnly({ useLocalStorageStore });
