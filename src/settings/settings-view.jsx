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
import React, { useState } from 'react';
import { Breadcrumbs, Button, Container, Divider, Padding } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';

export const DisplayerHeader = ({ mods }) => {
	const [t] = useTranslation();

	const onConfirm = () => console.log('save button clicked!');
	const onCancel = () => console.log('cancel button clicked!');

	const crumbs = [
		{
			id: 'general-mains',
			label: 'general',
			click: () => console.log('General')
		}
	];

	return(
		<Container orientation='vertical' mainAlignment='flex-start' height='fit' >
			<Container mainAlignment={'flex-end'} orientation='horizontal' padding={{all:'small'}} >
				<Breadcrumbs crumbs={ crumbs }/>
				{ mods && <Button label={t('displayer.button.secondary')} color='secondary' onClick={onCancel} /> }
				<Padding horizontal='small' />
				<Button label={t('displayer.button.primary')} color='primary' onClick={onConfirm} disabled={!mods}/>
			</Container>
			<Divider color="gray1"/>
		</Container>
	)
}

export const DisplayerContainer = ({setMods}) => {
	const onClick = () => setMods('ciaone');
	// load app settings inside
	return (
		<Container onClick={onClick}>
			ciaone
		</Container>
	)
}

export const Displayer = () => {
	const [mods, setMods] = useState(undefined);

	return(
		<Container background="gray5" mainAlignment="flex-start">
			<DisplayerHeader mods={mods} />
			<DisplayerContainer setMods={setMods}/>
		</Container>
	)
}
