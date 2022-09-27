/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { map } from 'lodash';
import React, { FC, ReactElement, useCallback, useMemo } from 'react';
import {
	Button,
	Chip,
	Container,
	Divider,
	Icon,
	Padding,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';
import AppContextProvider from '../boot/app/app-context-provider';
import { useSearchStore } from './search-store';
import { QueryChip, ResultLabelType } from '../../types';
import { useAppStore } from '../store/app';
import { SEARCH_APP_ID } from '../constants';
// import { RouteLeavingGuard } from '../ui-extras/nav-guard';

// eslint-disable-next-line @typescript-eslint/ban-types
const useQuery = (): [Array<QueryChip>, Function] =>
	useSearchStore((s) => [s.query, s.updateQuery]);
// eslint-disable-next-line @typescript-eslint/ban-types
const useDisableSearch = (): [boolean, Function] =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	useSearchStore((s) => [s.searchDisabled, s.setSearchDisabled]);

const getIconAndColor = (labelType: ResultLabelType): Array<string> => {
	if (labelType === ResultLabelType.WARNING) {
		return ['AlertTriangle', 'warning'];
	}
	if (labelType === ResultLabelType.ERROR) {
		return ['CloseSquare', 'error'];
	}
	return ['', ''];
};

const ResultsHeader: FC<{ label: string; labelType?: ResultLabelType }> = ({
	label,
	labelType = ResultLabelType.NORMAL
}) => {
	const [t] = useTranslation();
	const [query, updateQuery] = useQuery();
	const [, setDisabled] = useDisableSearch();

	const resetQuery = useCallback(() => {
		updateQuery([]);
		setDisabled(false);
	}, [updateQuery, setDisabled]);

	const labelTypeElem = useMemo<ReactElement | undefined>(() => {
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

	// let labelTypeElem: ReactElement | undefined;
	// if (labelType !== ResultLabelType.NORMAL) {
	// 	let icon = '';
	// 	let color = '';
	// 	if (labelType === ResultLabelType.WARNING) {
	// 		icon = 'AlertTriangle';
	// 		color = 'warning';
	// 	} else if (labelType === ResultLabelType.ERROR) {
	// 		icon = 'CloseSquare';
	// 		color = 'error';
	// 	}
	//
	// 	labelTypeElem = (
	// 		<Padding right="small">
	// 			<Icon icon={icon} size="large" color={color} />
	// 		</Padding>
	// 	);
	// }

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
					{labelTypeElem}
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
