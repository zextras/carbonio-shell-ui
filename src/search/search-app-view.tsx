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

import { map, filter } from 'lodash';
import React, { FC, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container, Text, Chip, Padding, Divider, Button } from '@zextras/zapp-ui';
import { useApps } from '../app-store/hooks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';
import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';

// eslint-disable-next-line @typescript-eslint/ban-types
const useQuery = (): [Array<any>, Function] => useSearchStore((s) => [s.query, s.updateQuery]);

const ResultsHeader: FC<{ query: Array<any>; label: string }> = ({ query, label }) => (
	<>
		<Container
			orientation="horizontal"
			mainAlignment="flex-start"
			background="gray5"
			height="fit"
			minHeight="48px"
			padding={{ horizontal: 'large', vertical: 'medium' }}
			style={{ flexWrap: 'wrap' }}
		>
			<Text color="secondary">{label}</Text>
			{map(query, (q, i) => (
				<Padding key={`${i}${q.label}`} all="extrasmall">
					<Chip {...q} background="gray2" />
				</Padding>
			))}
		</Container>
		<Divider color="gray3" />
	</>
);

export const SearchAppView: FC = () => {
	const apps = useApps();
	const routes = useMemo(
		() =>
			map(
				filter(apps, (app): boolean => !!app.views?.search),
				(app) => (
					<Route key={`/${app.core.package}`} path={`/${SEARCH_APP_ID}/${app.core.package}`}>
						<AppContextProvider pkg={app.core.package}>
							{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
							{/* @ts-ignore */}
							<app.views.search useQuery={useQuery} ResultsHeader={ResultsHeader} />
						</AppContextProvider>
					</Route>
				)
			),
		[apps]
	);
	return <Switch>{routes}</Switch>;
};
