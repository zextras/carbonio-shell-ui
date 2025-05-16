/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';

import { size } from 'lodash';

import type { DarkReaderPropValues } from './utils';
import { DARK_READER_VALUES } from '../constants';
import { useUserSettings } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';

export function isDarkReaderPropValues(
	maybeDarkReaderPropValue: unknown
): maybeDarkReaderPropValue is DarkReaderPropValues {
	return (
		typeof maybeDarkReaderPropValue === 'string' &&
		DARK_READER_VALUES.includes(maybeDarkReaderPropValue as DarkReaderPropValues)
	);
}

// return the final calculated value between carbonioPrefDarkMode value and carbonioWebUiDarkMode config
export function useDarkReaderResultValue(): undefined | DarkReaderPropValues {
	const settings = useUserSettings();
	const carbonioWebUiDarkMode = useLoginConfigStore((s) => s.carbonioWebUiDarkMode);

	const settingReceived = useMemo(
		() => size(settings.prefs) > 0 || size(settings.attrs) > 0 || size(settings.props) > 0,
		[settings]
	);

	return useMemo(() => {
		if (settingReceived) {
			return (
				settings.prefs.carbonioPrefDarkMode || (carbonioWebUiDarkMode && 'enabled') || 'disabled'
			);
		}
		return undefined;
	}, [settingReceived, settings, carbonioWebUiDarkMode]);
}
