/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormSubSection, Select } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import React, { FC, useCallback, useContext, useMemo } from 'react';
import {
	AccountSettings,
	isZappDarkreaderModeZimletProp,
	ZappDarkreaderModeZimletProp,
	ZimletProp
} from '../../../../types';
import { ThemeCallbacksContext } from '../../../boot/theme-provider';
import { DR_VALUES, SHELL_APP_ID } from '../../../constants';
import { getT } from '../../../store/i18n';
import { themeSubSection } from '../../general-settings-sub-sections';

const AppearanceSettings: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const currentDRMSetting = useMemo(
		() =>
			find<ZimletProp, ZappDarkreaderModeZimletProp>(
				settings.props,
				(value): value is ZappDarkreaderModeZimletProp => isZappDarkreaderModeZimletProp(value)
			)?._content,
		[settings]
	);
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
		() => find(items, { value: currentDRMSetting }),
		[currentDRMSetting, items]
	);
	const onSelectionChange = useCallback(
		(v) => {
			if (DR_VALUES.includes(v) && v !== currentDRMSetting) {
				setDarkReaderState(v);
				addMod('props', 'zappDarkreaderMode', { app: SHELL_APP_ID, value: v });
			}
		},
		[addMod, currentDRMSetting, setDarkReaderState]
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
				defaultSelection={defaultSelection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</FormSubSection>
	);
};

export default AppearanceSettings;
