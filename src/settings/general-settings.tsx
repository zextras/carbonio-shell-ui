/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState, FC, useMemo } from 'react';
import { Container, useSnackbar } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { includes, isEmpty } from 'lodash';
import { useUserSettings } from '../store/account';
import Logout from './components/general-settings/logout';
import AppearanceSettings from './components/general-settings/appearance-settings';
import ModuleVersionSettings from './components/general-settings/module-version-settings';
import OutOfOfficeSettings from './components/general-settings/out-of-office-view';
import UserQuota from './components/general-settings/user-quota';
import { editSettings } from '../network/edit-settings';
import { Mods } from '../../types';
import LanguageAndTimeZoneSettings from './language-and-timezone-settings';
import SearchSettingsView from './search-settings-view';
import SettingsHeader from './components/settings-header';

const GeneralSettings: FC = () => {
	const [mods, setMods] = useState<Mods>({});
	const [t] = useTranslation();
	const settings = useUserSettings();
	const [open, setOpen] = useState(false);
	const addMod = useCallback((type: 'props' | 'prefs', key, value) => {
		setMods((m) => ({
			...m,
			[type]: {
				...m?.[type],
				[key]: value
			}
		}));
	}, []);
	const createSnackbar = useSnackbar();

	const onSave = useCallback(() => {
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
	}, [createSnackbar, mods, t]);
	const onCancel = useCallback(() => {
		setMods({});
	}, []);
	const isDirty = useMemo(() => !isEmpty(mods), [mods]);
	const title = useMemo(() => t('settings.general.general', 'General Settings'), [t]);

	return (
		<>
			<SettingsHeader title={title} onCancel={onCancel} onSave={onSave} isDirty={isDirty} />
			<Container
				background="gray5"
				mainAlignment="flex-start"
				padding={{ all: 'medium' }}
				style={{ overflow: 'auto' }}
			>
				<AppearanceSettings settings={settings} addMod={addMod} />
				<LanguageAndTimeZoneSettings
					settings={settings}
					addMod={addMod}
					open={open}
					setOpen={setOpen}
				/>

				<OutOfOfficeSettings settings={settings} addMod={addMod} />
				<SearchSettingsView settings={settings} addMod={addMod} />
				<ModuleVersionSettings />
				<UserQuota mobileView={false} />
				<Logout />
			</Container>
		</>
	);
};

export default GeneralSettings;
