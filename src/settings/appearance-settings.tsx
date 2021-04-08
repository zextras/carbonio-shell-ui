import React, { FC, useState, useMemo, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Select } from '@zextras/zapp-ui';
import { find } from 'lodash';
import { ThemeCallbacksContext } from '../bootstrap/shell-theme-context-provider';
import { AccountSettings } from '../../types';

const AppearanceSettings: FC<{
	settings: AccountSettings;
	addMod: (type: string, key: string, value: string) => void;
}> = ({ settings, addMod }) => {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const [drMode, setDrMode] = useState<'auto' | 'enabled' | 'disabled'>(
		find(settings.props, ['name', 'zappDarkreaderMode'])?._content ?? 'auto'
	);
	const [t] = useTranslation();
	const items = useMemo(
		() => [
			{
				label: t('settins.general.theme_auto', 'Auto'),
				value: 'auto'
			},
			{
				label: t('settins.general.theme_enabled', 'Enabled'),
				value: 'enabled'
			},
			{
				label: t('settins.general.theme_disabled', 'Disabled'),
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
				addMod('props', 'zappDarkreaderMode', v);
			}
		},
		[addMod, drMode, setDarkReaderState]
	);
	return (
		<FormSubSection label={t('settins.general.theme_options', 'Theme Options')} maxWidth="512px">
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
