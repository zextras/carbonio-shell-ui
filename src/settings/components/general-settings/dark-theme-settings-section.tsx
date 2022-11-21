/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Select, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import { AddMod } from '../../../../types';
import { ThemeCallbacksContext } from '../../../boot/theme-provider';
import { DR_VALUES, SHELL_APP_ID } from '../../../constants';
import { getT } from '../../../store/i18n';
import { useDarkReaderResultValue } from '../../../custom-hooks/useDarkReaderResultValue';

const DarkThemeSettingSection: FC<{
	addMod: AddMod;
}> = ({ addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);

	const darkReaderResultValue = useDarkReaderResultValue();

	const t = getT();
	const items = useMemo(
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
		(v) => {
			if (DR_VALUES.includes(v) && v !== darkReaderResultValue) {
				setDarkReaderState(v);
				addMod('props', 'zappDarkreaderMode', { app: SHELL_APP_ID, value: v });
			}
		},
		[addMod, darkReaderResultValue, setDarkReaderState]
	);

	return (
		<>
			<Text size="medium" weight="bold">
				{t('settings.general.theme_options', 'Theme Options')}
			</Text>
			<Select
				items={items}
				selection={defaultSelection}
				defaultSelection={defaultSelection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</>
	);
};

export default DarkThemeSettingSection;
