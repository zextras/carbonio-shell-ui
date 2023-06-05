/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';

function isSameLocalStorageValue(valueA: unknown, valueB: unknown): boolean {
	return JSON.stringify(valueA) === JSON.stringify(valueB);
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
	const readValue = useCallback<() => T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	}, [initialValue, key]);

	const [storedValue, setStoredValue] = useState<T>(readValue());
	const shouldDispatchStorageEventRef = useRef(false);

	const setValue = useCallback(
		(value: T | ((val: T) => T)): void => {
			try {
				setStoredValue((prevState) => {
					const valueToStore = value instanceof Function ? value(prevState) : value;
					if (!isSameLocalStorageValue(valueToStore, prevState)) {
						window.localStorage.setItem(key, JSON.stringify(valueToStore));
						shouldDispatchStorageEventRef.current = true;
						return valueToStore;
					}
					return prevState;
				});
			} catch (error) {
				console.error(error);
			}
		},
		[key]
	);

	const updateValue = useCallback(() => {
		setStoredValue((prevState) => {
			const newValue = readValue();
			if (!isSameLocalStorageValue(prevState, newValue)) {
				return newValue;
			}
			return prevState;
		});
	}, [readValue]);

	useEffect(() => {
		window.addEventListener('storage', updateValue);
		return () => {
			window.removeEventListener('storage', updateValue);
		};
	}, [updateValue]);

	useEffect(() => {
		if (shouldDispatchStorageEventRef.current) {
			// dispatch event when stored value change,
			// but only after render to avoid possible update of parent component during render
			window.dispatchEvent(new Event('storage'));
			shouldDispatchStorageEventRef.current = false;
		}
	}, [storedValue]);

	return [storedValue, setValue];
}
