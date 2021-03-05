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

import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import { map } from 'lodash';
import LoadingView from '../bootstrap/loading-view';
import { Displayer } from './settings-view';

const generateSettingsApp = (setActiveApp, history) => ({
	id: 'settings-main',
	icon: 'Settings2Outline',
	active: false,
	allTos: ['/com_zextras_zapp_settings/', '/com_zextras_zapp_settings/general'],
	label: 'Settings',
	pkgName: 'com_zextras_zapp_settings',
	to: '/com_zextras_zapp_settings/',
	items: [
		{
			badgeCounter: undefined,
			id: 'general',
			label: 'General',
			parent: '1',
			onClick: () => {
				history.push('/com_zextras_zapp_settings/general');
			}
		}
	],
	click: () => {
		setActiveApp('settings-main');
		history.push('/com_zextras_zapp_settings/general');
	}
})

export function useSettingsApps(setActiveApp, history) {
	return generateSettingsApp(setActiveApp, history);
}

export const SettingsRoutes = () => {


	return (
		<>
			{map(['eeeee'], (route) => (
				<Route key="com_zextras_zapp_settings/general" exact path="/com_zextras_zapp_settings/general">
					<Suspense fallback={<LoadingView />}>
						<Displayer />
					</Suspense>
				</Route>
			))}
		</>
	);
};
