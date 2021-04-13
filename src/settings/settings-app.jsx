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

import React, { Suspense, useState, useEffect, lazy } from 'react';
import { Route } from 'react-router-dom';
import { map, reduce } from 'lodash';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import LoadingView from '../bootstrap/loading-view';
import AppContextProvider from '../app/app-context-provider';

const GeneralSettings = lazy(() => import('./general-settings'));

const generateSettingsApp = (appSettings, setActiveApp, history) => ({
	id: 'settings-main',
	icon: 'Settings2Outline',
	active: false,
	allTos: [
		'/com_zextras_zapp_settings/general',
		...map(appSettings, (item) => `/com_zextras_zapp_settings${item.to}`)
	],
	label: 'Settings',
	pkgName: 'com_zextras_zapp_settings',
	to: '/com_zextras_zapp_settings',
	items: [
		{
			badgeCounter: undefined,
			id: 'general',
			label: 'General',
			parent: '1',
			to: '/com_zextras_zapp_settings/general',
			onClick: () => {
				history.push('/com_zextras_zapp_settings/general');
			}
		},
		...appSettings
	],
	click: () => {
		setActiveApp('settings-main');
		history.push('/com_zextras_zapp_settings/general');
	}
});

export function useSettingsApps(cache, setActiveApp, history) {
	const [appSettings, setAppSettings] = useState(generateSettingsApp([], setActiveApp, history));
	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(app.settingsRoutes.pipe(rxMap((items) => ({ items, app }))));
					return acc;
				},
				[]
			)
		).subscribe((settingsAppItems) => {
			setAppSettings(
				generateSettingsApp(
					reduce(
						settingsAppItems,
						(acc, { items, app }) => {
							reduce(
								items,
								(acc2, appSettingsRoute) => {
									acc2.push({
										badgeCounter: undefined,
										id: appSettingsRoute.id,
										label: appSettingsRoute.label,
										icon: appSettingsRoute.icon || '',
										parent: '1',
										onClick: () => {
											history.push(`/com_zextras_zapp_settings${appSettingsRoute.to}`);
										},
										customComponent: appSettingsRoute.customComponent,
										to: appSettingsRoute.to,
										pkgName: app.pkg.package
									});
									return acc2;
								},
								acc
							);
							return acc;
						},
						[]
					),
					setActiveApp,
					history
				)
			);
		});
		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache, history, setActiveApp]);
	return appSettings;
}

export const SettingsRoutes = ({ cache }) => {
	const [routes, setRoutes] = useState([]);
	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(app.settingsRoutes.pipe(rxMap((settingsRoutes) => ({ settingsRoutes, app }))));
					return acc;
				},
				[]
			)
		).subscribe((settingsAppItems) => {
			setRoutes(
				reduce(
					settingsAppItems,
					(acc, { app, settingsRoutes }) => {
						reduce(
							settingsRoutes,
							(acc2, appSettingsRoute) => {
								acc2.push(
									<Route
										key={`com_zextras_zapp_settings${appSettingsRoute.to}`}
										exact
										path={`/com_zextras_zapp_settings${appSettingsRoute.to}`}
									>
										<Suspense fallback={<LoadingView />}>
											<AppContextProvider key={app.pkg.package} pkg={app.pkg}>
												<appSettingsRoute.view />
											</AppContextProvider>
										</Suspense>
									</Route>
								);
								return acc2;
							},
							acc
						);
						return acc;
					},
					[]
				)
			);
		});
		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache]);

	return (
		<>
			<Route
				key="com_zextras_zapp_settings/general"
				exact
				path="/com_zextras_zapp_settings/general"
			>
				<Suspense fallback={<LoadingView />}>
					<GeneralSettings />
				</Suspense>
			</Route>
			{routes}
		</>
	);
};
