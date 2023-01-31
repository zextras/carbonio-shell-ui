/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';

import ShellContext from './shell-context';

export function useIsMobile(): boolean {
	const { isMobile } = useContext(ShellContext);
	return isMobile;
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
	const setValue = (value: T | ((val: T) => T)): void => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			const valueToStoreJSON = JSON.stringify(valueToStore);
			setStoredValue((prevState) => {
				const prevValueJSON = JSON.stringify(prevState);
				if (prevValueJSON !== valueToStoreJSON) {
					localStorage.setItem(key, valueToStoreJSON);
					window.dispatchEvent(new Event('storage'));
					return valueToStore;
				}
				return prevState;
			});
		} catch (error) {
			console.error(error);
		}
	};

	const updateValue = useCallback(() => {
		setStoredValue(readValue());
	}, [readValue]);

	useEffect(() => {
		window.addEventListener('storage', updateValue);
		return () => {
			window.removeEventListener('storage', updateValue);
		};
	}, [readValue, updateValue]);

	return [storedValue, setValue];
}
