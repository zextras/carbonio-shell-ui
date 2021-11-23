import React, { useCallback, useState, FC } from 'react';
import { Breadcrumbs, Button, Container, Divider, Padding, useSnackbar } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Logout from './logout';
import AppearanceSettings from './appearance-settings';
import ModuleVersionSettings from './module-version-settings';
import OutOfOfficeSettings from './out-of-office-view';
import { useUserSettings } from '../store/account/hooks';
import { SETTINGS_APP_ID } from '../constants';
import { editSettings } from '../network/edit-settings';
import { Mods } from '../../types';

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
					label={t('settings.button.secondary', 'Cancel')}
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
	const [original] = useState(settings);
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
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		editSettings(mods)
			.then(() => {
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
				<OutOfOfficeSettings settings={settings} addMod={addMod} />
				<ModuleVersionSettings />
				<Logout />
			</Container>
		</>
	);
};

export default GeneralSettings;
