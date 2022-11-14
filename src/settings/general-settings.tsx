/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import { includes, isEmpty, size } from 'lodash';
import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
import { AddMod, Mods } from '../../types';
import { editSettings } from '../network/edit-settings';
import { useUserSettings } from '../store/account';
import { getT } from '../store/i18n';
import AppearanceSettings from './components/general-settings/appearance-settings';
import Logout from './components/general-settings/logout';
import ModuleVersionSettings from './components/general-settings/module-version-settings';
import OutOfOfficeSettings from './components/general-settings/out-of-office-view';
import UserQuota from './components/general-settings/user-quota';
import SettingsHeader from './components/settings-header';
import LanguageAndTimeZoneSettings from './language-and-timezone-settings';
import SearchSettingsView from './search-settings-view';
import { useLocalStorage } from '../shell/hooks';
import {
	ScalingSettingSection,
	ScalingSettingSectionRef
} from './components/general-settings/scaling-setting-section';
import DarkThemeSettingSection from './components/general-settings/dark-theme-settings-section';
import { LOCAL_STORAGE_SETTINGS_KEY } from '../constants';
import { ScalingSettings } from '../../types/settings';

const GeneralSettings: FC = () => {
	const [mods, setMods] = useState<Mods>({});
	const t = getT();
	const userSettings = useUserSettings();
	const [localStorageUnAppliedChanges, setLocalStorageUnAppliedChanges] = useState<ScalingSettings>(
		{}
	);
	const [localStorageSettings, setLocalStorageSettings] = useLocalStorage<ScalingSettings>(
		LOCAL_STORAGE_SETTINGS_KEY,
		{}
	);
	const [open, setOpen] = useState(false);

	const addLocalStoreChange = useCallback((key, value) => {
		setLocalStorageUnAppliedChanges((prevState) => ({
			...prevState,
			[key]: value
		}));
	}, []);

	const cleanLocalStoreChange = useCallback<(key: keyof ScalingSettings) => void>((key) => {
		setLocalStorageUnAppliedChanges((prevState) => {
			if (prevState[key]) {
				const nextState = { ...prevState };
				delete nextState[key];
				return nextState;
			}
			return prevState;
		});
	}, []);

	const addMod = useCallback<AddMod>((type, key, value) => {
		setMods((prevState) => ({
			...prevState,
			[type]: {
				...prevState?.[type],
				[key]: value
			}
		}));
	}, []);
	const createSnackbar = useSnackbar();

	const onSave = useCallback(() => {
		if (size(localStorageUnAppliedChanges) > 0) {
			setLocalStorageSettings({
				...localStorageSettings,
				...localStorageUnAppliedChanges
			});
			setLocalStorageUnAppliedChanges({});
		}
		if (size(mods) > 0) {
			editSettings(mods)
				.then(() => {
					if (mods.prefs && includes(Object.keys(mods.prefs), 'zimbraPrefLocale')) {
						setOpen(true);
					}
					createSnackbar({
						key: `new`,
						replace: true,
						type: 'info',
						label: t('message.snackbar.settings_saved', 'Edits saved correctly'),
						autoHideTimeout: 3000,
						hideButton: true
					});
				})
				.catch(() => {
					createSnackbar({
						key: `new`,
						replace: true,
						type: 'error',
						label: t('snackbar.error', 'Something went wrong, please try again'),
						autoHideTimeout: 3000,
						hideButton: true
					});
				});
			setMods({});
		}
	}, [
		localStorageUnAppliedChanges,
		mods,
		setLocalStorageSettings,
		localStorageSettings,
		createSnackbar,
		t
	]);

	const scalingSettingSectionRef = useRef<ScalingSettingSectionRef>(null);

	const onCancel = useCallback(() => {
		setMods({});
		if (size(localStorageUnAppliedChanges) > 0) {
			scalingSettingSectionRef.current?.reset();
		}
	}, [localStorageUnAppliedChanges]);

	const isDirty = useMemo(
		() => !isEmpty(mods) || !isEmpty(localStorageUnAppliedChanges),
		[mods, localStorageUnAppliedChanges]
	);

	const title = useMemo(() => t('settings.general.general', 'General Settings'), [t]);

	return (
		<>
			<SettingsHeader title={title} onCancel={onCancel} onSave={onSave} isDirty={isDirty} />
			<Container
				background="gray5"
				mainAlignment="flex-start"
				crossAlignment={'flex-start'}
				gap="0.5rem"
				padding={{ all: 'medium' }}
				style={{ overflow: 'auto' }}
			>
				<AppearanceSettings>
					<ScalingSettingSection
						ref={scalingSettingSectionRef}
						scalingSettings={localStorageSettings}
						addLocalStoreChange={addLocalStoreChange}
						cleanLocalStoreChange={cleanLocalStoreChange}
					/>
					<DarkThemeSettingSection accountSettings={userSettings} addMod={addMod} />
				</AppearanceSettings>
				<LanguageAndTimeZoneSettings
					settings={userSettings}
					addMod={addMod}
					open={open}
					setOpen={setOpen}
				/>

				<OutOfOfficeSettings settings={userSettings} addMod={addMod} />
				<SearchSettingsView settings={userSettings} addMod={addMod} />
				<ModuleVersionSettings />
				<UserQuota mobileView={false} />
				<Logout />
			</Container>
		</>
	);
};

export default GeneralSettings;
