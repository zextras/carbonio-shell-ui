/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';
import { find, size } from 'lodash';
import { useUserSettings } from '../store/account';
import { useLoginConfigStore } from '../store/login/store';
import {
	DarkReaderPropValues,
	isZappDarkreaderModeZimletProp,
	ZappDarkreaderModeZimletProp,
	ZimletProp
} from '../../types';

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
