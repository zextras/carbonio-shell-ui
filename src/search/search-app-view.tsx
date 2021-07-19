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

import React, { FC, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { map } from 'lodash';
import { Container } from '@zextras/zapp-ui';
import { useApps } from '../app-store/hooks';
import { SEARCH_APP_ID, SETTINGS_APP_ID } from '../constants';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';

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

export const SearchAppView: FC = () => {
	const apps = useApps();
	const routes = useMemo(
		() =>
			map(apps, (app, appId) =>
				app.views?.search ? (
					<Route key={appId} exact path={`/${SEARCH_APP_ID}/${appId}`}>
						<AppContextProvider pkg={appId}>
							{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
							{/* @ts-ignore */}
							<app.views.search />
						</AppContextProvider>
					</Route>
				) : null
			),
		[apps]
	);
	return (
		<Switch>
			{routes}
			<Container background="warning" />
		</Switch>
	);
};
