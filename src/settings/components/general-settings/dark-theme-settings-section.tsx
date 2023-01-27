/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, SelectItem, SingleSelectionOnChange, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
	const [selection, setSelection] = useState<SelectItem>();

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

	const setSelectNewValue = useCallback(
		(value) => {
			const item = find(items, { value });
			if (item) {
				setSelection(item);
			}
			setDarkReaderState(value);
		},
		[items, setDarkReaderState]
	);

	const onSelectionChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (isDarkReaderPropValues(value)) {
				if (value) {
					setSelectNewValue(value);
				}
				if (value !== darkReaderResultValue) {
					addMod('props', DARK_READER_PROP_KEY, { app: SHELL_APP_ID, value });
				} else {
					removeMod('props', DARK_READER_PROP_KEY);
				}
			}
		},
		[addMod, darkReaderResultValue, removeMod, setSelectNewValue]
	);

	useEffect(() => {
		if (darkReaderResultValue) {
			setSelectNewValue(darkReaderResultValue);
		}
	}, [darkReaderResultValue, items, setSelectNewValue]);

	if (!selection) {
		return null;
	}
	return (
		<>
			<Text size="medium" weight="bold">
				{t('settings.general.theme_options', 'Theme Options')}
			</Text>
			<Select
				items={items}
				selection={selection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</>
	);
};

export default DarkThemeSettingSection;
