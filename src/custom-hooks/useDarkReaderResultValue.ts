/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';
import { find, size } from 'lodash';
import { useUserSettings } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import type { DarkReaderPropValues, ZappDarkreaderModeZimletProp, ZimletProp } from '../../types';
import { DARK_READER_PROP_KEY, DARK_READER_VALUES, SHELL_APP_ID } from '../constants';

export function isZappDarkreaderModeZimletProp(
	prop: ZimletProp
): prop is ZappDarkreaderModeZimletProp {
	return prop.name === DARK_READER_PROP_KEY && prop.zimlet === SHELL_APP_ID;
}

export function isDarkReaderPropValues(
	maybeDarkReaderPropValue: unknown
): maybeDarkReaderPropValue is DarkReaderPropValues {
	return (
		typeof maybeDarkReaderPropValue === 'string' &&
		DARK_READER_VALUES.includes(maybeDarkReaderPropValue as DarkReaderPropValues)
	);
}

// return the final calculated value between ZappDarkreaderModeZimletProp value and carbonioWebUiDarkMode config
export function useDarkReaderResultValue(): undefined | DarkReaderPropValues {
	const settings = useUserSettings();
	const { carbonioWebUiDarkMode } = useLoginConfigStore();

	const settingReceived = useMemo(
		() => size(settings.prefs) > 0 || size(settings.attrs) > 0 || size(settings.props) > 0,
		[settings]
	);

	const darkReaderResultValue = useMemo(() => {
		if (settingReceived) {
			const result = find<ZimletProp, ZappDarkreaderModeZimletProp>(
				settings.props,
				(value): value is ZappDarkreaderModeZimletProp => isZappDarkreaderModeZimletProp(value)
			)?._content;

			return result || (carbonioWebUiDarkMode && 'enabled') || 'disabled';
		}
		return undefined;
	}, [settingReceived, settings, carbonioWebUiDarkMode]);

	return darkReaderResultValue;
}
