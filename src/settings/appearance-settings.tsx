import React, { FC, useState, useMemo, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Select } from '@zextras/zapp-ui';
import { find } from 'lodash';
import { ThemeCallbacksContext } from '../bootstrap/shell-theme-context-provider';
import { AccountSettings } from '../../types';

const AppearanceSettings: FC<{
	settings: AccountSettings;
	addMod: (type: string, key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const [drMode, setDrMode] = useState<'auto' | 'enabled' | 'disabled'>(
		find(settings.props, ['name', 'zappDarkreaderMode'])?._content ?? 'auto'
	);
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			{
				label: t('settins.general.theme_auto'),
				value: 'auto'
			},
			{
				label: t('settins.general.theme_enabled'),
				value: 'enabled'
			},
			{
				label: t('settins.general.theme_disabled'),
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
	return (
		<FormSubSection
			label={t('settins.general.theme_options', 'Theme Options')}
			minWidth="calc(min(100%, 512px))"
			width="50%"
		>
			<Select
				items={items}
				selection={defaultSelection}
				label={t('settins.general.theme_mode', 'Theme Mode')}
				onChange={onSelectionChange}
			/>
		</FormSubSection>
	);
};

export default AppearanceSettings;
