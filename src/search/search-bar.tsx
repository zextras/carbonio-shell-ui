/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

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
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { filter, find, map, reduce } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from '../shell/hooks';
import { SEARCH_APP_ID } from '../constants';
import { useApps } from '../store/app/hooks';
import { useSearchStore } from './search-store';
import { QueryChip, SearchBarProps, SelectLabelFactoryProps } from '../../types';
import { handleKeyboardShortcuts } from '../keyboard-shortcuts/keyboard-shortcuts';

const OutlinedIconButton = styled(IconButton)`
	border: 1px solid
		${({ theme, disabled }): string =>
			disabled ? theme.palette.primary.disabled : theme.palette.primary.regular};
	display: 'block';
	& svg {
		border: none;
	}
`;

const StyledChipInput = styled(ChipInput)`
	&:hover {
		outline: none;
		background: ${({ theme, disabled }): string =>
			disabled ? 'gray5' : theme.palette.gray5.hover};
	}
`;

const StyledContainer = styled(Container)`
	height: 44px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-2px);
	}
`;

const SelectLabelFactory: FC<SelectLabelFactoryProps> = ({ selected, open, focus, disabled }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const theme: any = useContext(ThemeContext);
	const color = useMemo(
		// eslint-disable-next-line no-nested-ternary
		() => (disabled ? '#CCCCCC' : open || focus ? 'primary' : 'text'),
		[disabled, open, focus]
	);
	return (
		<Container
			orientation="horizontal"
			background={disabled ? 'gray5' : 'gray6'}
			height={44}
			width="fit"
			minWidth="150px"
			crossAlignment="center"
			mainAlignment="space-between"
			borderRadius="half"
			style={{
				borderRight: `1px solid ${theme.palette.gray4.regular}`,
				cursor: disabled ? 'default' : 'pointer'
			}}
		>
			<Row takeAvailableSpace mainAlignment="unset" padding={{ left: 'small' }}>
				<Text size="small" color={color}>
					{selected[0]?.label}
				</Text>
			</Row>
			<Icon
				size="large"
				icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
				color={color}
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
	const [inputTyped, setInputTyped] = useState('');
	const history = useHistory();
	const { updateQuery, updateModule, query, searchDisabled, setSearchDisabled } = useSearchStore();
	const [moduleSelection, setModuleSelection] = useState<{
		value: string;
		label: string;
	}>();
	const [isTyping, setIsTyping] = useState(false);
	// const [changedBySearchBar, setChangedBySearchBar] = useState(false);

	const moduleSelectorItems = useMemo<
		Array<{ label: string; value: string; customComponent: JSX.Element }>
	>(
		() =>
			filter(apps, (app) => !!app.views?.search).map((app) => ({
				customComponent: (
					<Container mainAlignment="flex-start" orientation="horizontal">
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

	useEffect(() => {
		setModuleSelection((current) =>
			currentApp && currentApp !== SEARCH_APP_ID
				? find(moduleSelectorItems, (mod) => mod.value === currentApp) ?? moduleSelectorItems[0]
				: current ?? moduleSelectorItems[0]
		);
	}, [currentApp, moduleSelectorItems]);

	useEffect(() => {
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
		setIsTyping(false);
		setInputState([]);
		setSearchDisabled(false);
		updateQuery([]);
		setInputTyped('');
	}, [setSearchDisabled, updateQuery]);

	const onSearch = useCallback(() => {
		updateQuery((currentQuery) => {
			const ref = inputRef?.current;

			if (ref) ref.innerText = '';
			if (inputTyped.length > 0) {
				const newInputState = [
					...inputState,
					...map(inputTyped?.split(' '), (item) => ({ label: item, hasAvatar: false }))
				];
				setInputState(newInputState);
				setInputTyped('');
				return reduce(
					newInputState,
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
				);
			}
			setInputTyped('');
			return reduce(
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
			);
		});
		if (currentApp !== SEARCH_APP_ID) {
			history.push(`/${SEARCH_APP_ID}/${moduleSelection?.value}`);
		}
		setSearchIsEnabled(false);
		// setChangedBySearchBar(true);
	}, [currentApp, history, inputState, moduleSelection?.value, updateQuery, inputTyped]);

	const appSuggestions = useMemo<Array<QueryChip & { hasAvatar: false }>>(
		() =>
			filter(storedValue, (v) => v.app === moduleSelection?.value)
				.reverse()
				.map((item: QueryChip) => ({
					...item,
					hasAvatar: false,
					disabled: searchDisabled,
					click: (): void => {
						setInputState((q: Array<QueryChip>) => [...q, { ...item, hasAvatar: false }]);
					}
				})),
		[moduleSelection?.value, storedValue, setInputState, searchDisabled]
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
							id: `${value.length}`,
							hasAvatar: false
						}
					]
				);
			}
			/** Commented for future reference */
			// if (inputRef.current) {
			// 	updateOptions(inputRef.current, newQuery);
			// }
			setInputState(newQuery);
			setSearchIsEnabled(true);
		},
		[appSuggestions, moduleSelection?.value, setStoredValue]
	);

	const onInputType = useCallback(
		(ev) => {
			if (ev.target.textContent === '') {
				setIsTyping(false);
			} else if (!isTyping) {
				setIsTyping(true);
			}
			setInputTyped(ev.target.textContent);
			updateOptions(ev.target, query);
		},
		[query, updateOptions, isTyping]
	);
	useEffect(() => {
		if (moduleSelection?.value) {
			const suggestions = filter(
				appSuggestions,
				(suggestion) => suggestion?.app === moduleSelection.value
			).slice(0, 5);

			setOptions(suggestions);
		}
	}, [appSuggestions, moduleSelection?.value]);

	const onSelectionChange = useCallback(
		(newVal) => {
			setModuleSelection(find(moduleSelectorItems, (item) => item.value === newVal));
			// setInputState([]);
			// updateQuery([]);
			if (currentApp === SEARCH_APP_ID) {
				history.push(`/${SEARCH_APP_ID}/${newVal}`);
			}
		},
		[currentApp, history, moduleSelectorItems]
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

	const disableOptions = useMemo(() => !(options.length > 0) || isTyping, [options, isTyping]);

	const placeholder = useMemo(
		() =>
			inputHasFocus && moduleSelection
				? t('search.active_input_label', 'Separate your keywords by a comma or pressing TAB')
				: t('search.idle_input_label', 'Search in {{module}}', {
						module: moduleSelection?.label
				  }),
		[t, moduleSelection, inputHasFocus]
	);

	const clearButtonPlaceholder = useMemo(
		() =>
			showClear || isTyping
				? t('search.clear', 'Clear search input')
				: t('search.already_clear', 'Search input is already clear'),
		[showClear, t, isTyping]
	);
	const searchBtnTooltipLabel = useMemo(() => {
		if (searchIsEnabled && inputState.length > 0) {
			return t('search.start', 'Start search');
		}
		if (inputHasFocus) {
			return t(
				'search.type_or_choose_suggestion',
				'Type or choose some keywords to start a search'
			);
		}
		if (query.length > 0) {
			return t('label.edit_to_start_search', 'Edit your search to start a new one');
		}
		return t('search.type_to_start_search', 'Type some keywords to start a search');
	}, [t, searchIsEnabled, inputState.length, inputHasFocus, query.length]);

	const onChipAdd = useCallback(
		(newChip: string) => {
			setIsTyping(false);
			setInputTyped('');
			if (moduleSelection?.value) {
				const suggestions = filter(
					appSuggestions,
					(suggestion) => suggestion?.app === moduleSelection?.value
				).slice(0, 5);

				setOptions(suggestions);
			}
			return {
				label: newChip.trim(),
				hasAvatar: false,
				avatarLabel: ''
			};
		},
		[appSuggestions, moduleSelection?.value]
	);

	useEffect(() => {
		setInputState(map(query, (q) => ({ ...q, disabled: searchDisabled })));
	}, [searchDisabled, query]);

	const addFocus = useCallback(() => setInputHasFocus(true), []);
	const removeFocus = useCallback(() => setInputHasFocus(false), []);
	const disableClearButton = useMemo(() => (isTyping ? false : !showClear), [showClear, isTyping]);

	return (
		<Container orientation="horizontal" minWidth="0" ref={containerRef}>
			<Tooltip
				disabled={!searchDisabled}
				maxWidth="100%"
				label={t(
					'search.unable_to_parse_query',
					'Unable to complete the search, clear it and retry'
				)}
			>
				<Container orientation="horizontal" width="fill">
					<Container minWidth="512px" width="fill">
						<Container orientation="horizontal" width="fill">
							<Container width="fit">
								<Select
									disabled={searchDisabled}
									items={moduleSelectorItems}
									background="gray6"
									selectedBackgroundColor="highlight"
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
								<StyledChipInput
									disabled={searchDisabled}
									inputRef={inputRef}
									value={inputState}
									onAdd={onChipAdd}
									options={options}
									placeholder={placeholder}
									confirmChipOnBlur={false}
									confirmChipOnSpace={false}
									separators={['Comma']}
									background={searchDisabled ? 'gray5' : 'gray6'}
									style={{
										cursor: 'pointer',
										overflowX: 'hidden'
									}}
									onChange={onQueryChange}
									onInputType={onInputType}
									onBlur={removeFocus}
									onFocus={addFocus}
									disableOptions={disableOptions}
									requireUniqueChips={false}
								/>
							</StyledContainer>
						</Container>
					</Container>

					{!disableClearButton && (
						<Padding left="small">
							<Tooltip label={clearButtonPlaceholder} placement="bottom">
								<OutlinedIconButton
									disabled={disableClearButton}
									icon="BackspaceOutline"
									iconColor="primary"
									onClick={clearSearch}
								/>
							</Tooltip>
						</Padding>
					)}

					<Padding left="small">
						<Tooltip
							maxWidth="100%"
							disabled={searchDisabled}
							label={searchBtnTooltipLabel}
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
			</Tooltip>
		</Container>
	);
};
