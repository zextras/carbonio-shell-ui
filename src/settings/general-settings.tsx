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
import React, { useCallback, useState, FC } from 'react';
import { Breadcrumbs, Button, Container, Divider, Padding } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useDispatch } from '../store/shell-store-hooks';
import { modifyPrefs } from '../store/accounts-slice';
import AppearanceSettings from './appearance-settings';
import ModuleVersionSettings from './module-version-settings';
import OutOfOfficeSettings from './out-of-office-view';
import { useUserAccounts } from '../shell/hooks';
import { SETTINGS_APP_ID } from '../constants';

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

type PropsMods = Record<string, { app: string; value: unknown }>;
type PrefsMods = Record<string, unknown>;

type Mods = {
	props?: PropsMods;
	prefs?: PrefsMods;
};

const GeneralSettings: FC = () => {
	const [mods, setMods] = useState<Mods>({});
	const [t] = useTranslation();
	const [acct] = useUserAccounts();
	const [original] = useState(acct.settings);
	const dispatch = useDispatch();
	const addMod = useCallback((type: 'props' | 'prefs', key, value) => {
		setMods((m) => ({
			...m,
			[type]: {
				...m?.[type],
				[key]: value
			}
		}));
	}, []);
	const onSave = useCallback(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		dispatch(modifyPrefs(mods));
		setMods({});
	}, [dispatch, mods]);
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
				<AppearanceSettings settings={acct.settings} addMod={addMod} />
				<OutOfOfficeSettings settings={acct.settings} addMod={addMod} />
				<ModuleVersionSettings />
			</Container>
		</>
	);
};

export default GeneralSettings;
