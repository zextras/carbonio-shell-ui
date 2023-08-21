/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo } from 'react';

import {
	Button,
	Chip,
	Container,
	Divider,
	Icon,
	Padding,
	Text
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useSearchStore } from './search-store';
import { type SearchState } from '../../types';
import AppContextProvider from '../boot/app/app-context-provider';
import { ResultLabelType, SEARCH_APP_ID } from '../constants';
import { useAppStore } from '../store/app';
import { getT } from '../store/i18n';

const useQuery = (): [query: SearchState['query'], updateQuery: SearchState['updateQuery']] =>
	useSearchStore((s) => [s.query, s.updateQuery]);

const useDisableSearch = (): [
	isDisabled: SearchState['searchDisabled'],
	setDisabled: SearchState['setSearchDisabled']
] => useSearchStore((s) => [s.searchDisabled, s.setSearchDisabled]);

const getIconAndColor = (labelType: ResultLabelType): [icon: string, color: string] => {
	if (labelType === ResultLabelType.WARNING) {
		return ['AlertTriangle', 'warning'];
	}
	if (labelType === ResultLabelType.ERROR) {
		return ['CloseSquare', 'error'];
	}
	return ['', ''];
};

interface ResultsHeaderProps {
	label: string;
	labelType?: ResultLabelType;
}

const ResultsHeader = ({
	label,
	labelType = ResultLabelType.NORMAL
}: ResultsHeaderProps): JSX.Element => {
	const t = getT();
	const [query, updateQuery] = useQuery();
	const [, setDisabled] = useDisableSearch();

	const resetQuery = useCallback(() => {
		updateQuery([]);
		setDisabled(false);
	}, [updateQuery, setDisabled]);

	const labelTypeElem = useMemo<JSX.Element>(() => {
		if (labelType === ResultLabelType.NORMAL) {
			return <></>;
		}

		const [icon, color] = getIconAndColor(labelType);
		return (
			<Padding right="small">
				<Icon icon={icon} size="large" color={color} />
			</Padding>
		);
	}, [labelType]);

	const chipItems = useMemo(
		() =>
			map(query, (queryChip, index) => (
				<Padding key={`${index}${queryChip.label}`} all="extrasmall">
					<Chip {...queryChip} background={'gray2'} />
				</Padding>
			)),
		[query]
	);

	return (
		<>
			<Container
				orientation="horizontal"
				mainAlignment="flex-start"
				width="100%"
				background={'gray5'}
				height="fit"
				minHeight="3rem"
				maxHeight="7.5rem"
				style={{ overflow: 'hidden' }}
				padding={{ horizontal: 'large', vertical: 'medium' }}
			>
				<Container width="85%" orientation="horizontal" wrap="wrap" mainAlignment="flex-start">
					{labelTypeElem}
					<Text color="secondary">{label}</Text>
					{chipItems}
				</Container>
				{query?.length > 0 && (
					<Container width="15%" mainAlignment="flex-start" crossAlignment="flex-start">
						<Button
							label={t('label.clear_search_query', 'CLEAR SEARCH')}
							icon="CloseOutline"
							color="primary"
							width="fill"
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

export const SearchAppView = (): JSX.Element => {
	const searchViews = useAppStore((s) => s.views.search);
	const { module } = useSearchStore();
	const modules = useAppStore((s) => s.views.search);

	const fullModule = useMemo(() => modules.find((m) => m.route === module), [module, modules]);

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
		<Switch>
			{routes}
			<Redirect
				exact
				strict
				from={`/${SEARCH_APP_ID}`}
				to={`/${SEARCH_APP_ID}/${fullModule ? fullModule.route : searchViews[0]?.route}`}
			/>
		</Switch>
	);
};
