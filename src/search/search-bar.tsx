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
import { filter, find, reduce } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from '../shell/hooks';
import { SEARCH_APP_ID } from '../constants';
import { useApps } from '../store/app/hooks';
import { useSearchStore } from './search-store';
import { QueryChip, SearchBarProps, SelectLabelFactoryProps } from '../../types';
import { handleKeyboardShortcuts } from '../keyboard-shortcuts/keyboard-shortcuts';

const OutlinedIconButton = styled(IconButton)`
	border: 1px solid ${({ theme }): string => theme.palette.primary.regular};
	display: 'block';
	& svg {
		border: none;
	}
`;

const StyledContainer = styled(Container)`
	height: 44px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-2px);
	}
`;

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
				<Text size="small" color={open || focus ? 'primary' : 'text'}>
					{selected[0]?.label}
				</Text>
			</Row>
			<Icon
				size="large"
				icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
				color={open || focus ? 'primary' : 'text'}
				style={{ alignSelf: 'center' }}
			/>
		</Container>
	);
};

export const SearchBar: FC<SearchBarProps> = ({ currentApp, primaryAction, secondaryActions }) => {
	const [searchIsEnabled, setSearchIsEnabled] = useState(false);
	const inputRef = useRef<HTMLInputElement>();
	const [t] = useTranslation();
	const [storedValue, setStoredValue] = useLocalStorage('search_suggestions', []);
	const apps = useApps();
	const history = useHistory();
	const { updateQuery, updateModule, query } = useSearchStore();
	const [moduleSelection, setModuleSelection] = useState<{
		value: string;
		label: string;
	}>();
	// const [changedBySearchBar, setChangedBySearchBar] = useState(false);
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
						<Text>{app.core.display}</Text>
					</Container>
				),
				label: app.core.display,
				value: app.core.route
			})),
		[apps]
	);

	const [options, setOptions] = useState<Array<{ label: string; hasAvatar: false }>>([]);

	const onChipAdd = useCallback(
		(newChip: string) => ({
			label: newChip.trim(),
			hasAvatar: false
		}),
		[]
	);

	useEffect(() => {
		console.count('sono stato io 1');
		setModuleSelection((current) =>
			currentApp && currentApp !== SEARCH_APP_ID
				? find(moduleSelectorItems, (mod) => mod.value === currentApp) ?? moduleSelectorItems[0]
				: current ?? moduleSelectorItems[0]
		);
	}, [currentApp, moduleSelectorItems]);

	useEffect(() => {
		console.count('sono stato io 2');
		updateModule(moduleSelection?.value ?? moduleSelectorItems[0]?.value);
	}, [moduleSelection?.value, moduleSelectorItems, updateModule]);

	const [inputHasFocus, setInputHasFocus] = useState(false);

	const [inputState, setInputState] = useState(query);
	const showClear = useMemo(
		() =>
			inputState.length > 0 ||
			(inputRef.current?.textContent && inputRef.current?.textContent?.length > 0),
		[inputState.length]
	);
	const clearSearch = useCallback((): void => {
		if (inputRef.current) {
			inputRef.current.innerText = '';
			inputRef.current?.focus();
		}
		setInputState([]);
	}, []);
	const onSearch = useCallback(() => {
		updateQuery((currentQuery) =>
			reduce(
				inputState,
				(acc, chip) => {
					if (!find(currentQuery, (c: QueryChip): boolean => c.label === chip.label)) {
						acc.push(chip);
					}
					return acc;
				},
				filter(
					currentQuery,
					(qchip: QueryChip): boolean =>
						qchip.isQueryFilter ||
						!!find(inputState, (c: QueryChip): boolean => c.label === qchip.label)
				)
			)
		);
		if (currentApp !== SEARCH_APP_ID) {
			history.push(`/${SEARCH_APP_ID}/${moduleSelection?.value}`);
		}
		setSearchIsEnabled(false);
		// setChangedBySearchBar(true);
	}, [currentApp, history, inputState, moduleSelection?.value, updateQuery]);

	useEffect(() => {
		console.count('sono stato io 3');
		const ref = inputRef.current;
		const focusCb = (): void => setInputHasFocus(true);
		if (ref) {
			ref.addEventListener('focus', focusCb);
		}
		return (): void => {
			ref?.removeEventListener('focus', focusCb);
		};
	}, [onChipAdd, onSearch]);

	const appSuggestions = useMemo<Array<QueryChip & { hasAvatar: false }>>(
		() =>
			filter(storedValue, (v) => v.app === moduleSelection?.value)
				.reverse()
				.map((item: QueryChip) => ({
					...item,
					hasAvatar: false,
					click: (): void => {
						setInputState((q: Array<QueryChip>) => [...q, item]);
					}
				})),
		[moduleSelection?.value, storedValue, setInputState]
	);

	const updateOptions = useCallback(
		(target: HTMLInputElement, q: Array<any>): void => {
			if (target.textContent && target.textContent.length > 0) {
				setOptions(
					appSuggestions
						.filter(
							(v: QueryChip): boolean =>
								v.label?.indexOf(target.textContent as string) !== -1 &&
								!find(q, (i) => i.value === v.label)
						)
						.slice(0, 5)
				);
			} else {
				setOptions(appSuggestions.slice(0, 5));
			}
		},
		[appSuggestions]
	);

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
			setInputState(newQuery);
			setSearchIsEnabled(true);
		},
		[appSuggestions, moduleSelection?.value, setStoredValue, updateOptions]
	);

	const onInputType = useCallback(
		(ev) => {
			updateOptions(ev.target, query);
		},
		[query, updateOptions]
	);

	const onSelectionChange = useCallback(
		(newVal) => {
			setModuleSelection(find(moduleSelectorItems, (item) => item.value === newVal));
			setInputState([]);
			updateQuery([]);
			if (currentApp === SEARCH_APP_ID) {
				history.push(`/${SEARCH_APP_ID}/${newVal}`);
			}
		},
		[currentApp, history, moduleSelectorItems, updateQuery]
	);
	const [triggerSearch, setTriggerSearch] = useState(false);
	const containerRef = useRef<HTMLDivElement>();

	// useEffect(() => {
	// 	const handler = (event: KeyboardEvent): unknown =>
	// 		handleKeyboardShortcuts({
	// 			event,
	// 			inputRef,
	// 			primaryAction,
	// 			secondaryActions,
	// 			currentApp
	// 		});
	// 	document.addEventListener('keydown', handler);
	// 	return (): void => {
	// 		document.removeEventListener('keydown', handler);
	// 	};
	// }, [currentApp, inputRef, primaryAction, secondaryActions]);

	useEffect(() => {
		console.count('sono stato io 4');
		const ref = inputRef.current;
		const searchCb = (ev: any): void => {
			if (ev.key === 'Enter') {
				setTriggerSearch(true);
			}
		};
		if (ref) {
			ref.addEventListener('keyup', searchCb);
		}
		return (): void => {
			if (ref) {
				ref.removeEventListener('keyup', searchCb);
			}
		};
	}, [onSearch]);
	useEffect(() => {
		console.count('sono stato io 5');
		if (triggerSearch) {
			onSearch();
			setTriggerSearch(false);
		}
	}, [onSearch, triggerSearch]);

	// useEffect(() => {
	// 	setChangedBySearchBar((value) => {
	// 		if (!value) {
	// 			setInputState(filter(query, (q) => !q.isQueryFilter));
	// 		}
	// 		return false;
	// 	});
	// }, [query]);
	return (
		<Container orientation="horizontal" minWidth="0" ref={containerRef}>
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
							style={{ fontSize: '14px' }}
							color="text"
							fontSize="small"
						/>
					</Container>
					<StyledContainer orientation="horizontal">
						<ChipInput
							inputRef={inputRef}
							value={inputState}
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
						<OutlinedIconButton icon="BackspaceOutline" iconColor="primary" onClick={clearSearch} />
					</Tooltip>
				</Padding>
			)}
			<Padding left="small">
				<Tooltip
					label={
						searchIsEnabled && inputState.length > 0
							? t('search.start', 'Start search')
							: t('search.edit_to_start', 'Edit your search to start a new one')
					}
					placement="bottom"
				>
					<IconButton
						icon="Search"
						disabled={!(searchIsEnabled && inputState.length > 0)}
						backgroundColor="primary"
						iconColor="gray6"
						onClick={onSearch}
					/>
				</Tooltip>
			</Padding>
		</Container>
	);
};
