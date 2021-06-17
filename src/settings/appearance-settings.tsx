import React, { FC, useState, useMemo, useContext, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Select } from '@zextras/zapp-ui';
import { find } from 'lodash';
import { ThemeCallbacksContext } from '../bootstrap/shell-theme-context-provider';
import { AccountSettings } from '../../types';

type DRPropValues = 'auto' | 'enabled' | 'disabled';

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
				addMod('props', 'zappDarkreaderMode', { app: 'com_zextras_zapp_shell', value: v });
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
