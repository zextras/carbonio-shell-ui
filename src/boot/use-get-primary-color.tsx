/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect, useMemo } from 'react';

import { size } from 'lodash';

import { LOCAL_STORAGE_LAST_PRIMARY_KEY } from '../constants';
import { useDarkMode } from '../dark-mode/use-dark-mode';
import { useLocalStorage } from '../shell/hooks/useLocalStorage';
import { useLoginConfigStore } from '../store/login/store';

export function useGetPrimaryColor(): string | undefined {
	const [localStorageLastPrimary, setLocalStorageLastPrimary] = useLocalStorage<
		Partial<Record<'dark' | 'light', string>> | undefined
	>(LOCAL_STORAGE_LAST_PRIMARY_KEY, undefined);
	const { carbonioWebUiPrimaryColor, carbonioWebUiDarkPrimaryColor, loaded } =
		useLoginConfigStore();
	const { darkModeEnabled, darkReaderStatus } = useDarkMode();

	const primaryColor = useMemo(() => {
		if (
			darkReaderStatus !== undefined &&
			(carbonioWebUiPrimaryColor || carbonioWebUiDarkPrimaryColor)
		) {
			if (darkModeEnabled) {
				return carbonioWebUiDarkPrimaryColor || carbonioWebUiPrimaryColor;
			}
			return carbonioWebUiPrimaryColor || carbonioWebUiDarkPrimaryColor;
		}
		if (localStorageLastPrimary && size(localStorageLastPrimary) > 0 && !loaded) {
			return (
				(darkModeEnabled && (localStorageLastPrimary.dark || localStorageLastPrimary.light)) ||
				localStorageLastPrimary.light ||
				localStorageLastPrimary.dark
			);
		}
		return undefined;
	}, [
		carbonioWebUiDarkPrimaryColor,
		carbonioWebUiPrimaryColor,
		darkModeEnabled,
		darkReaderStatus,
		loaded,
		localStorageLastPrimary
	]);

	useEffect(() => {
		if (darkReaderStatus !== undefined) {
			setLocalStorageLastPrimary((prevState) => ({
				...prevState,
				[darkModeEnabled ? 'dark' : 'light']: primaryColor
			}));
		}
	}, [darkModeEnabled, darkReaderStatus, primaryColor, setLocalStorageLastPrimary]);

	return primaryColor;
}
