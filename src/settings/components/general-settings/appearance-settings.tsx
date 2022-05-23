/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Select } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import { ThemeCallbacksContext } from '../../../boot/theme-provider';
import { AccountSettings, DRPropValues } from '../../../../types';
import { SHELL_APP_ID } from '../../../constants';
import { themeSubSection } from '../../general-settings-sub-sections';

const AppearanceSettings: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const currentDRMSetting = useMemo(
		() =>
			find(settings.props, { name: 'zappDarkreaderMode', zimlet: SHELL_APP_ID })
				?._content as DRPropValues,
		[settings]
	);
	const [t] = useTranslation();
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
		() => find(items, { value: currentDRMSetting }),
		[currentDRMSetting, items]
	);
	const onSelectionChange = useCallback(
		(v) => {
			setDarkReaderState(v);
			addMod('props', 'zappDarkreaderMode', { app: SHELL_APP_ID, value: v });
		},
		[addMod, setDarkReaderState]
	);
	const subSection = useMemo(() => themeSubSection(t), [t]);
	return (
		<FormSubSection
			label={subSection.label}
			minWidth="calc(min(100%, 512px))"
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
