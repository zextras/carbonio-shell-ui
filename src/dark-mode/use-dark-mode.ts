/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useEffect, useState } from 'react';
import { useDarkReaderResultValue } from './use-dark-reader-result-value';
import { getPrefersColorSchemeDarkMedia } from './utils';
import type { DarkReaderPropValues } from '../../types';

export const useDarkMode = (): {
	darkModeEnabled: boolean;
	darkReaderStatus: DarkReaderPropValues | undefined;
} => {
	const darkReaderResultValue = useDarkReaderResultValue();

	const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);

	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkModeEnabled(
				(darkReaderResultValue === 'auto' && getPrefersColorSchemeDarkMedia().matches) ||
					darkReaderResultValue === 'enabled'
			);
		}
	}, [darkReaderResultValue]);

	useEffect(() => {
		const setCallback = (event: MediaQueryListEvent): void => {
			setDarkModeEnabled(event.matches);
		};
		getPrefersColorSchemeDarkMedia().addEventListener('change', setCallback);
		return (): void => {
			getPrefersColorSchemeDarkMedia().removeEventListener('change', setCallback);
		};
	}, []);

	return { darkModeEnabled, darkReaderStatus: darkReaderResultValue };
};
