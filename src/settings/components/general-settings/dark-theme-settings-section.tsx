/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, SelectProps, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { AddMod, DarkReaderPropValues, isDarkReaderPropValues, RemoveMod } from '../../../../types';
import { ThemeCallbacksContext } from '../../../boot/theme-provider';
import { DARK_READER_PROP_KEY, SHELL_APP_ID } from '../../../constants';
import { getT } from '../../../store/i18n';
import { useDarkReaderResultValue } from '../../../custom-hooks/useDarkReaderResultValue';

const DarkThemeSettingSection: FC<{
	addMod: AddMod;
	removeMod: RemoveMod;
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
	const onSelectionChange = useCallback<NonNullable<SelectProps['onChange']>>(
		(value) => {
			if (isDarkReaderPropValues(value)) {
				setDarkReaderState(value);
				if (value !== darkReaderResultValue) {
					addMod('props', DARK_READER_PROP_KEY, { app: SHELL_APP_ID, value });
				} else {
					removeMod('props', DARK_READER_PROP_KEY);
				}
			}
		},
		[addMod, darkReaderResultValue, removeMod, setDarkReaderState]
	);

	return (
		<>
			<Text size="medium" weight="bold">
				{t('settings.general.theme_options', 'Theme Options')}
			</Text>
			<Select
				items={items}
				selection={defaultSelection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</>
	);
};

export default DarkThemeSettingSection;
