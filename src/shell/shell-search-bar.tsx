/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import React, { useContext, useState, useCallback, useEffect, useMemo, FC, useRef } from 'react';
import {
	ChipInput,
	Container,
	IconButton,
	Tooltip,
	ThemeContext,
	Select,
	Row,
	Icon,
	Text,
	Padding
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { filter, find } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from './hooks';
import { SEARCH_APP_ID } from '../constants';
import { useApps } from '../app-store/hooks';
import { useSearchStore } from '../search/search-store';

const StyledContainer = styled(Container)`
	height: 42px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-1px);
	}
`;

type SelectLabelFactoryProps = {
	selected: [{ label: string; value: string }];
	open: boolean;
	focus: boolean;
};

const SelectLabelFactory: FC<SelectLabelFactoryProps> = ({ selected, open, focus }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const theme: any = useContext(ThemeContext);
	return (
		<Container
			orientation="horizontal"
			background="gray5"
			height={42}
			width="fill"
			crossAlignment="center"
			mainAlignment="space-between"
			borderRadius="half"
			style={{ borderRight: `1px solid ${theme.palette.gray4.regular}` }}
			padding={{
				left: 'extrasmall',
				vertical: 'extrasmall'
			}}
		>
			<Row takeAvailableSpace mainAlignment="unset" padding={{ left: 'extrasmall' }}>
				<Text size="medium" color={open || focus ? 'primary' : 'text'}>
					{selected[0]?.label}
				</Text>
			</Row>
			<Icon
				size="large"
				icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
				color={open || focus ? 'primary' : 'secondary'}
				style={{ alignSelf: 'center' }}
			/>
		</Container>
	);
};
type SearchBarProps = {
	currentApp: string;
};

export const SearchBar: FC<SearchBarProps> = ({ currentApp }) => {
	const inputRef = useRef<HTMLInputElement>();
	const theme = useContext(ThemeContext) as unknown;
	const [t] = useTranslation();
	const [storedValue, setStoredValue] = useLocalStorage('search_suggestions', []);
	const apps = useApps();
	const history = useHistory();
	const update = useSearchStore((s) => s.update);
	useEffect(() => {
		window.addEventListener('keypress', (event: KeyboardEvent) => {
			// isContentEditable is actually present
			// @ts-ignore
			if (event.key === '/' && event?.target?.isContentEditable === false) {
				event.preventDefault();
				inputRef.current?.focus();
			}
		});
	}, []);

	const moduleSelectorItems = useMemo<
		Array<{ label: string; value: string; customComponent: JSX.Element }>
	>(
		() =>
			filter(apps, (app) => !!app.views?.search).map((app) => ({
				customComponent: (
					<Container width="fill" mainAlignment="flex-start" orientation="horizontal">
						<Padding horizontal="extrasmall">
							<Icon icon={app.icon} />
						</Padding>
						<Text>{app.core.name}</Text>
					</Container>
				),
				label: app.core.name,
				value: app.core.package
			})),
		[apps]
	);

	const [moduleSelection, setModuleSelection] = useState<{ value: string }>();

	const appSuggestions = useMemo(
		() => filter(storedValue, (v) => v.app === moduleSelection?.value).reverse(),
		[moduleSelection, storedValue]
	);
	useEffect(() => {
		setModuleSelection(
			currentApp
				? find(moduleSelectorItems, (mod) => mod.value === currentApp) ?? moduleSelectorItems[0]
				: moduleSelectorItems[0]
		);
	}, [currentApp, moduleSelectorItems]);

	const [query, setQuery] = useState<Array<string>>([]);
	const onSearch = useCallback(() => {
		update(moduleSelection?.value, query.join(' '));
		if (currentApp !== SEARCH_APP_ID) {
			history.push('/search');
		}
	}, [currentApp, history, moduleSelection?.value, query, update]);

	const [options, setOptions] = useState<Array<{ label: string }>>([]);

	const updateOptions = useCallback(
		(target: HTMLInputElement): void => {
			if (target.textContent && target.textContent.length > 0) {
				setOptions(
					appSuggestions
						.filter(
							(v: { label: string }): boolean =>
								v.label?.indexOf(target.textContent as string) !== -1
						)
						.slice(0, 5)
				);
				return;
			}
			setOptions(appSuggestions.slice(0, 5));
		},
		[appSuggestions]
	);
	const onInputType = useCallback(
		(ev) => {
			updateOptions(ev.target);
		},
		[updateOptions]
	);
	const clearSearch = useCallback((): void => {
		if (inputRef.current) {
			inputRef.current.innerText = '';
			inputRef.current?.focus();
		}
		// eslint-disable-line no-param-reassign
		setQuery([]);
	}, []);
	const onQueryChange = useCallback(
		(newQuery) => {
			if (
				newQuery[newQuery.length - 1]?.label &&
				moduleSelection?.value &&
				!find(appSuggestions, (v) => v.label === newQuery[newQuery.length - 1]?.label)
			) {
				setStoredValue(
					(
						value: Array<{ value: string; label: string; icon: string; app: string; id: string }>
					) => [
						...value,
						{
							value: newQuery[newQuery.length - 1].label,
							label: newQuery[newQuery.length - 1].label,
							icon: 'ClockOutline',
							app: moduleSelection.value,
							id: `${value.length}`
						}
					]
				);
			}
			if (inputRef.current) {
				updateOptions(inputRef.current);
			}
			setQuery(newQuery);
		},
		[appSuggestions, moduleSelection?.value, setStoredValue, updateOptions]
	);

	const onSelectionChange = useCallback(
		(newVal) => {
			setModuleSelection(find(moduleSelectorItems, (item) => item.value === newVal));
		},
		[moduleSelectorItems]
	);

	const showClear = useMemo(
		() =>
			query.length > 0 ||
			(inputRef.current?.textContent && inputRef.current?.textContent?.length > 0),
		[query.length]
	);
	return (
		<Container orientation="horizontal" mainAlignment="flex-start">
			<Container
				maxHeight="42px"
				orientation="horizontal"
				mainAlignment="flex-start"
				width="50%"
				maxWidth="512px"
			>
				<Container minWidth="128px" width="35%" padding={{ left: 'small' }}>
					<Select
						items={moduleSelectorItems}
						background="gray6"
						label={t('search.module', 'Module')}
						selection={moduleSelection}
						onChange={onSelectionChange}
						LabelFactory={SelectLabelFactory}
					/>
				</Container>
				<StyledContainer orientation="horizontal">
					<ChipInput
						inputRef={inputRef}
						value={query}
						placeholder={t('search.input_label', 'Search')}
						confirmChipOnBlur
						background="gray5"
						style={{
							cursor: 'pointer'
						}}
						onChange={onQueryChange}
						onInputType={onInputType}
						options={options}
					/>
				</StyledContainer>
			</Container>
			{showClear && (
				<Padding left="small">
					<Tooltip label={t('search.clear', 'Clear search')} placement="bottom">
						<IconButton
							icon="BackspaceOutline"
							style={{
								// @ts-ignore
								border: `1px solid ${theme.palette.primary.regular}`,
								display: 'block',
								cursor: 'pointer'
							}}
							iconColor="primary"
							onClick={clearSearch}
						/>
					</Tooltip>
				</Padding>
			)}
			<Padding left="small">
				<Tooltip
					disabled={query.length < 1}
					label={t('search.start', 'Start search')}
					placement="bottom"
				>
					<IconButton
						icon="Search"
						disabled={query.length < 1}
						style={{
							cursor: 'pointer'
						}}
						backgroundColor={query.length > 0 ? 'primary' : 'transparent'}
						iconColor="gray6"
						onClick={onSearch}
					/>
				</Tooltip>
			</Padding>
		</Container>
	);
};
