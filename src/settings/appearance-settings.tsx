/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { FC, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Select } from '@zextras/zapp-ui';
import { find } from 'lodash';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { AccountSettings, DRPropValues } from '../../types';

const AppearanceSettings: FC<{
	settings: AccountSettings;
	addMod: (type: 'prefs' | 'props', key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const [drMode, setDrMode] = useState<DRPropValues>(
		((find(settings.props, ['name', 'zappDarkreaderMode'])?._content as unknown) as DRPropValues) ??
			'auto'
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
	const defaultSelection = useMemo(() => find(items, ['value', drMode]) ?? items[0], [
		drMode,
		items
	]);
	const onSelectionChange = useCallback(
		(v) => {
			if (v !== drMode) {
				setDrMode((old) => (v !== old ? v : old));
				setDarkReaderState(v);
				addMod('props', 'zappDarkreaderMode', { app: 'carbonio-shell', value: v });
			}
		},
		[addMod, drMode, setDarkReaderState]
	);
	useEffect(
		() => (): void =>
			setDarkReaderState(
				((find(settings.props, ['name', 'zappDarkreaderMode'])
					?._content as unknown) as DRPropValues) ?? 'auto'
			),
		[setDarkReaderState, settings.props]
	);
	return (
		<FormSubSection
			label={t('settings.general.theme_options', 'Theme Options')}
			minWidth="calc(min(100%, 512px))"
			width="50%"
		>
			<Select
				items={items}
				selection={defaultSelection}
				label={t('settings.general.theme_mode', 'Theme Mode')}
				onChange={onSelectionChange}
			/>
		</FormSubSection>
	);
};

export default AppearanceSettings;
