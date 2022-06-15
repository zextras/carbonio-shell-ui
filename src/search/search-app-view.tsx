/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { map } from 'lodash';
import React, { FC, useCallback, useMemo } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import {
	Container,
	Chip,
	Padding,
	Divider,
	Text,
	ButtonOld as Button
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../boot/app/app-context-provider';
import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { QueryChip } from '../../types';
// import { RouteLeavingGuard } from '../ui-extras/nav-guard';

// eslint-disable-next-line @typescript-eslint/ban-types
const useQuery = (): [Array<QueryChip>, Function] =>
	useSearchStore((s) => [s.query, s.updateQuery]);
// eslint-disable-next-line @typescript-eslint/ban-types
const useDisableSearch = (): [boolean, Function] =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	useSearchStore((s) => [s.searchDisabled, s.setSearchDisabled]);
const ResultsHeader: FC<{ label: string }> = ({ label }) => {
	const [t] = useTranslation();
	const [query, updateQuery] = useQuery();
	const [disabled, setDisabled] = useDisableSearch();

	const resetQuery = useCallback(() => {
		updateQuery([]);
		setDisabled(false);
	}, [updateQuery, setDisabled]);
	return (
		<>
			<Container
				orientation="horizontal"
				mainAlignment="flex-start"
				width="100%"
				background="gray5"
				height="fit"
				minHeight="48px"
				maxHeight="120px"
				style={{ overflow: 'hidden' }}
				padding={{ horizontal: 'large', vertical: 'medium' }}
			>
				<Container width="85%" orientation="horizontal" wrap="wrap" mainAlignment="flex-start">
					<Text color="secondary">{label}</Text>

					{map(query, (q, i) => (
						<Padding key={`${i}${q.label}`} all="extrasmall">
							<Chip {...q} background="gray2" />
						</Padding>
					))}
				</Container>
				{query?.length > 0 && (
					<Container width="15%" mainAlignment="flex-start" crossAlignment="flex-start">
						<Button
							label={t('label.clear_search_query', 'CLEAR SEARCH')}
							icon="CloseOutline"
							color="primary"
							size="fill"
							type="ghost"
							onClick={resetQuery}
						/>
					</Container>
				)}
			</Container>
			<Divider color="gray3" />
		</>
	);
};

export const SearchAppView: FC = () => {
	const searchViews = useAppStore((s) => s.views.search);
	const routes = useMemo(
		() =>
			map(searchViews, (view) => (
				<Route key={`/${view.route}`} path={`/${SEARCH_APP_ID}/${view.route}`}>
					<AppContextProvider pkg={view.app}>
						<view.component
							useQuery={useQuery}
							ResultsHeader={ResultsHeader}
							useDisableSearch={useDisableSearch}
						/>
					</AppContextProvider>
				</Route>
			)),
		[searchViews]
	);

	return (
		<>
			{/* <RouteLeavingGuard
				when
				title={t('search.leave.title', 'Are you sure you want to leave this module?')}
			>
				<Text>{t('search.leave.warning', 'The current search results will be lost')}</Text>
			</RouteLeavingGuard> */}
			<Switch>
				{routes}
				<Redirect
					exact
					strict
					from={`/${SEARCH_APP_ID}`}
					to={`/${SEARCH_APP_ID}/${searchViews[0]?.route}`}
				/>
			</Switch>
		</>
	);
};
