/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState, FC, useEffect } from 'react';
import {
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Padding,
	useSnackbar
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { includes } from 'lodash';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logout from './components/general-settings/logout';
import AppearanceSettings from './components/general-settings/appearance-settings';
import ModuleVersionSettings from './components/general-settings/module-version-settings';
import OutOfOfficeSettings from './components/general-settings/out-of-office-view';
import UserQuota from './components/general-settings/user-quota';
import { useUserSettings } from '../store/account/hooks';
import { SETTINGS_APP_ID } from '../constants';
import { editSettings } from '../network/edit-settings';
import { Mods } from '../../types';
import LanguageAndTimeZoneSettings from './language-and-timezone-settings';
import SearchSettingsView from './search-settings-view';

export const DisplayerHeader: FC<{
	label: string;
	onCancel: (mods: Record<string, unknown>) => void;
	onSave: (mods: Record<string, unknown>) => void;
	mods: Record<string, unknown>;
}> = ({ label, onCancel, onSave, mods }) => {
	const [t] = useTranslation();
	const history = useHistory();
	const onSaveCb = useCallback(() => {
		onSave(mods);
	}, [mods, onSave]);
	const onCancelCb = useCallback(() => {
		onCancel(mods);
	}, [mods, onCancel]);
	const crumbs = [
		{
			id: 'settings',
			label: t('settings.app', 'Settings'),
			click: (): void => history.push(`/${SETTINGS_APP_ID}/`)
		},
		{
			id: 'general',
			label,
			click: (): void => history.push(`/${SETTINGS_APP_ID}/`)
		}
	];

	return (
		<Container
			orientation="vertical"
			mainAlignment="flex-start"
			height="fit"
			padding={{ bottom: 'medium' }}
		>
			<Container mainAlignment="flex-end" orientation="horizontal" padding={{ all: 'small' }}>
				<Breadcrumbs crumbs={crumbs} />
				<Button
					label={t('label.cancel', 'Cancel')}
					color="secondary"
					onClick={onCancelCb}
					disabled={!mods}
				/>
				<Padding horizontal="small" />
				<Button
					label={t('settings.button.primary', 'Save')}
					color="primary"
					onClick={onSaveCb}
					disabled={!mods}
				/>
			</Container>
			<Divider color="gray1" />
		</Container>
	);
};

const GeneralSettings: FC = () => {
	const [mods, setMods] = useState<Mods>({});
	const [t] = useTranslation();
	const settings = useUserSettings();
	// const [original] = useState(settings);
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

	return (
		<>
			<Container
				background="gray5"
				mainAlignment="flex-start"
				padding={{ all: 'medium' }}
				style={{ overflow: 'auto' }}
			>
				<DisplayerHeader
					mods={mods}
					label={t('settings.general.general', 'General Settings')}
					onCancel={onCancel}
					onSave={onSave}
				/>
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
