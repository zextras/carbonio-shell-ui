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
	Padding,
	Dropdown
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { filter, find } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from '../shell/hooks';
import { SEARCH_APP_ID } from '../constants';
import { useApps } from '../app-store/hooks';
import { useSearchStore } from './search-store';

const StyledContainer = styled(Container)`
	height: 44px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-2px);
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
			height={44}
			width="fit"
			minWidth="150px"
			crossAlignment="center"
			mainAlignment="space-between"
			borderRadius="half"
			style={{ borderRight: `1px solid ${theme.palette.gray4.regular}` }}
		>
			<Row takeAvailableSpace mainAlignment="unset" padding={{ left: 'small' }}>
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
	const { updateQuery, updateModule, query } = useSearchStore();
	const [moduleSelection, setModuleSelection] = useState<{ value: string; label: string }>();

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

	const appSuggestions = useMemo(
		() =>
			filter(storedValue, (v) => v.app === moduleSelection?.value)
				.reverse()
				.map((item: { label: string }) => ({
					...item,
					hasAvatar: false,
					click: (): void => {
						updateQuery((q: Array<{ label: string }>) => [...q, item]);
					}
				})),
		[moduleSelection?.value, storedValue, updateQuery]
	);
	const onSearch = useCallback(() => {
		if (currentApp !== SEARCH_APP_ID) {
			history.push(`/search/${moduleSelection?.value}`);
		}
	}, [currentApp, history, moduleSelection?.value]);

	const [options, setOptions] = useState<Array<{ label: string }>>([]);

	const updateOptions = useCallback(
		(target: HTMLInputElement, q: Array<any>): void => {
			if (target.textContent && target.textContent.length > 0) {
				setOptions(
					appSuggestions
						.filter(
							(v: { label: string }): boolean =>
								v.label?.indexOf(target.textContent as string) !== -1 &&
								!find(q, (i) => i.value === v.label)
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
			updateOptions(ev.target, query);
		},
		[query, updateOptions]
	);
	const clearSearch = useCallback((): void => {
		if (inputRef.current) {
			inputRef.current.innerText = '';
			inputRef.current?.focus();
		}
		updateQuery([]);
	}, [updateQuery]);
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
				updateOptions(inputRef.current, newQuery);
			}
			updateQuery(newQuery);
		},
		[appSuggestions, moduleSelection?.value, setStoredValue, updateOptions, updateQuery]
	);

	const onSelectionChange = useCallback(
		(newVal) => {
			setModuleSelection(find(moduleSelectorItems, (item) => item.value === newVal));
			updateQuery([]);
			history.push(`/search/${newVal}`);
		},
		[history, moduleSelectorItems, updateQuery]
	);

	const onChipAdd = useCallback(
		(newChip: string) => ({
			label: newChip,
			hasAvatar: false
		}),
		[]
	);

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

	useEffect(() => {
		const nextModule = find(moduleSelectorItems, (mod) => mod.value === currentApp);
		if (nextModule) {
			setModuleSelection(nextModule);
		} else if (!moduleSelection) {
			setModuleSelection(moduleSelectorItems[0]);
		}

		// setModuleSelection(
		// 	currentApp && currentApp !== SEARCH_APP_ID
		// 		? find(moduleSelectorItems, (mod) => mod.value === currentApp) ?? moduleSelectorItems[0]
		// 		: moduleSelectorItems[0]
		// );
	}, [currentApp, moduleSelection, moduleSelectorItems]);
	useEffect(() => {
		updateModule(moduleSelection?.value ?? moduleSelectorItems[0]?.value);
	}, [moduleSelection?.value, moduleSelectorItems, updateModule]);

	const showClear = useMemo(
		() =>
			query.length > 0 ||
			(inputRef.current?.textContent && inputRef.current?.textContent?.length > 0),
		[query.length]
	);

	const [inputHasFocus, setInputHasFocus] = useState(false);

	useEffect(() => {
		const ref = inputRef.current;
		const focusCb = (): void => setInputHasFocus(true);
		const search = (ev: KeyboardEvent): void => {
			if (ev.key === 'Enter') {
				onSearch();
			}
		};
		if (ref) {
			ref.addEventListener('keypress', search);
			ref.addEventListener('focus', focusCb);
		}
		return (): void => {
			ref?.removeEventListener('keypress', search);
			ref?.removeEventListener('focus', focusCb);
		};
	}, [onSearch]);

	return (
		<Container orientation="horizontal">
			<Container minWidth="512px" width="fill">
				<Container orientation="horizontal" width="fill">
					<Container width="fit">
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
							onAdd={onChipAdd}
							placeholder={
								inputHasFocus && moduleSelection
									? t('search.active_input_label', 'Separate keywords with a comma or TAB')
									: t('search.idle_input_label', 'Search in {{module}}', {
											module: moduleSelection?.label
									  })
							}
							confirmChipOnBlur
							confirmChipOnSpace={false}
							separators={['Comma', 'Enter']}
							background="gray5"
							style={{
								cursor: 'pointer',
								overflowX: 'hidden'
							}}
							onChange={onQueryChange}
							onInputType={onInputType}
						/>
					</StyledContainer>
				</Container>
				<Dropdown
					maxHeight="234px"
					disableAutoFocus
					disableRestoreFocus
					confirmChipOnBlur={false}
					confirmChipOnSpace={false}
					display="block"
					width="100%"
					maxWidth="100%"
					items={options}
					forceOpen={inputHasFocus && options.length > 0}
					onClose={(): void => setInputHasFocus(false)}
				>
					<div style={{ width: '100%' }} />
				</Dropdown>
			</Container>
			{showClear && (
				<Padding left="small">
					<Tooltip label={t('search.clear', 'Clear search input')} placement="bottom">
						<IconButton
							icon="BackspaceOutline"
							style={{
								// @ts-ignore
								border: `1px solid ${theme.palette.primary.regular}`,
								display: 'block'
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
						backgroundColor="primary"
						iconColor="gray6"
						onClick={onSearch}
					/>
				</Tooltip>
			</Padding>
		</Container>
	);
};
