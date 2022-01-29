/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useState, FC, useMemo } from 'react';
import {
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Padding,
	useSnackbar,
	Shimmer
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cloneDeep, isEqual, includes } from 'lodash';
import Logout from './logout';
import AppearanceSettings from './appearance-settings';
import ModuleVersionSettings from './module-version-settings';
import OutOfOfficeSettings from './out-of-office-view';
import UserQuota from './user-quota';
import { useUserSettings } from '../store/account';
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
	isDisabled: boolean;
}> = ({ label, onCancel, onSave, mods, isDisabled }) => {
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
					label={t('label.discard_changes', 'DISCARD CHANGES')}
					color="secondary"
					onClick={onCancelCb}
					disabled={isDisabled}
				/>
				<Padding horizontal="small" />
				<Button
					label={t('settings.button.primary', 'Save')}
					color="primary"
					onClick={onSaveCb}
					disabled={isDisabled}
				/>
			</Container>
			<Divider color="gray1" />
		</Container>
	);
};

const GeneralSettings: FC = () => {
	const [mods, setMods] = useState<Mods>({});
	const [t] = useTranslation();
	const [settings, setSettings] = useState(useUserSettings());
	const [updatedSettings, setUpdatedSettings] = useState(settings);
	const [loading, setLoading] = useState(false);
	const [original] = useState(settings);
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
	const isDisabled = useMemo(() => {
		const settingsToCompare = cloneDeep(settings);
		if (mods.prefs) {
			Object.assign(settingsToCompare.prefs, { ...mods.prefs });
		}
		if (mods.props) {
			const propName: any = Object.keys(mods?.props)[0];
			const propValue: any = Object.values(mods?.props)[0].value;
			const appName: any = Object.values(mods?.props)[0].app;
			if (settingsToCompare.props.length === 0) {
				settingsToCompare.props.push({
					zimlet: appName,
					name: propName,
					_content: propValue
				});
			} else {
				const index = settingsToCompare.props.findIndex((item) => item.name === propName);
				if (index !== -1) {
					settingsToCompare.props[index]._content = propValue;
				}
			}
		}
		setUpdatedSettings(settingsToCompare);
		return isEqual(settingsToCompare, settings);
	}, [mods, settings]);
	const callLoader = (): void => {
		setLoading(true);
		setTimeout(() => setLoading(false), 10);
	};
	const onSave = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		editSettings(mods)
			.then(() => {
				setSettings(updatedSettings);
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
	}, [createSnackbar, mods, t, updatedSettings]);
	const onCancel = useCallback(() => {
		setMods({});
		setSettings(settings);
		callLoader();
	}, [settings]);

	return (
		<>
			{loading ? (
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					width="fill"
					crossAlignment="flex-start"
				>
					<Shimmer.FormSection>
						<Shimmer.FormSubSection />
					</Shimmer.FormSection>
				</Container>
			) : (
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
						isDisabled={isDisabled}
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
			)}
		</>
	);
};

export default GeneralSettings;
