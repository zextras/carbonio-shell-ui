/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormSubSection, Select } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { ThemeCallbacksContext } from '../../../boot/theme-provider';
import { SHELL_APP_ID } from '../../../constants';
import { getT } from '../../../store/i18n';
import { themeSubSection } from '../../general-settings-sub-sections';
import { useDarkReaderResultValue } from '../../../custom-hooks/useDarkReaderResultValue';
import { DarkReaderPropValues, isDarkReaderPropValues } from '../../../../types';

const AppearanceSettings: FC<{
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
	removeMod: (type: 'prefs' | 'props', key: string) => void;
}> = ({ addMod, removeMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);

	const darkReaderResultValue = useDarkReaderResultValue();

	const t = getT();
	const items = useMemo<Array<{ label: string; value: DarkReaderPropValues }>>(
		() => [
			{
				label: t('settings.general.theme_auto', 'Auto'),
				value: 'auto'
			},
			{
				label: t('settings.general.theme_enabled', 'Enabled'),
				value: 'enabled'
			},
			{
				label: t('settings.general.theme_disabled', 'Disabled'),
				value: 'disabled'
			}
		],
		[t]
	);
	const defaultSelection = useMemo(
		() => find(items, { value: darkReaderResultValue }),
		[darkReaderResultValue, items]
	);
	const onSelectionChange = useCallback(
		(value) => {
			if (isDarkReaderPropValues(value)) {
				if (value !== darkReaderResultValue) {
					setDarkReaderState(value);
					addMod('props', 'zappDarkreaderMode', { app: SHELL_APP_ID, value });
				} else {
					setDarkReaderState(value);
					removeMod('props', 'zappDarkreaderMode');
				}
			}
		},
		[addMod, darkReaderResultValue, removeMod, setDarkReaderState]
	);
	const subSection = useMemo(() => themeSubSection(t), [t]);
	return (
		<FormSubSection
			label={subSection.label}
			minWidth="calc(min(100%, 32rem))"
			width="50%"
			id={subSection.id}
		>
			<Select
				items={items}
				selection={defaultSelection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</FormSubSection>
	);
};

export default AppearanceSettings;
