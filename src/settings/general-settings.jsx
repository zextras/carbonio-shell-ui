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
import React, { useCallback, useState } from 'react';
import { Breadcrumbs, Button, Container, Divider, Padding } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import {  useHistory} from 'react-router-dom';
import { useUserAccounts, useDispatch } from '../store/shell-store-hooks';
import { modifyPrefs } from '../store/accounts-slice';

export const DisplayerHeader = ({ label, onCancel, onSave, mods }) => {
	const [t] = useTranslation();
	const history = useHistory();
	const onSaveCb = useCallback(() => {
		console.log('save button clicked!'); onSave(mods);
	}, [mods, onSave]);
	const onCancelCb = useCallback(() => {
		console.log('cancel button clicked!'); onCancel(mods);
	}, [mods, onCancel]);

	const crumbs = [
		{
			id: 'settings',
			label: 'Settings',
			click: () => history.push('/com_zextras_zapp_settings/general')
		},
		{
			id: 'general',
			label,
			click: () => history.push('/com_zextras_zapp_settings/general')
		}
	];

	return(
		<Container orientation="vertical" mainAlignment="flex-start" height="fit" >
			<Container mainAlignment="flex-end" orientation="horizontal" padding={{all:'small'}} >
				<Breadcrumbs crumbs={ crumbs }/>
				<Button label={t('settings.button.secondary')} color='secondary' onClick={onCancelCb} disabled={!!mods}/>
				<Padding horizontal='small' />
				<Button label={t('settings.button.primary')} color='primary' onClick={onSaveCb} disabled={!mods}/>
			</Container>
			<Divider color="gray1"/>
		</Container>
	)
}

const GeneralSettings = () => {
	const [mods, setMods] = useState(undefined);
	// const accounts = useUserAccounts();
	// const dispatch = useDispatch();
	return(
		<Container background="gray5" mainAlignment="flex-start">
			<DisplayerHeader mods={mods} label="General" onCancel={console.log} onSave={console.log} />
		</Container>
	);
}

export default GeneralSettings;