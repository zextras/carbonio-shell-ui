/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState, useCallback, useEffect, useMemo, FC, useRef } from 'react';
import {
	ChipInput,
	Container,
	IconButton,
	Tooltip,
	Padding
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { filter, find, map, reduce } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from '../shell/hooks';
import { SEARCH_APP_ID } from '../constants';

import { useSearchStore } from './search-store';
import { QueryChip, SearchBarProps } from '../../types';
import { ModuleSelector } from './module-selector';

const OutlinedIconButton = styled(IconButton)`
	border: 1px solid
		${({ theme, disabled }): string =>
			disabled ? theme.palette.primary.disabled : theme.palette.primary.regular};
	display: block;
	& svg {
		border: none;
	}
`;

const StyledChipInput = styled(ChipInput)`
	padding: 0 16px;
	&:hover {
		outline: none;
		background: ${({ theme, disabled }): string =>
			disabled ? 'gray5' : theme.palette.gray5.hover};
	}
`;

const StyledContainer = styled(Container)`
	height: 42px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-2px);
	}
`;

type SearchLocalStorage = Array<{
	value: string;
	label: string;
	icon: string;
	app: string;
	id: string;
}>;
export const SearchBar: FC<SearchBarProps> = ({
	activeRoute
	// primaryAction,
	// secondaryActions
}) => {
	const [searchIsEnabled, setSearchIsEnabled] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [t] = useTranslation();
	const [storedValue, setStoredValue] = useLocalStorage<SearchLocalStorage>(
		'search_suggestions',
		[]
	);
	const [inputTyped, setInputTyped] = useState('');
	const history = useHistory();
	const { updateQuery, module, query, searchDisabled, setSearchDisabled } = useSearchStore();
	// const [moduleSelection, setModuleSelection] = useState<{
	// 	value: string;
	// 	label: string;
	// }>();
	const [isTyping, setIsTyping] = useState(false);
	// const [changedBySearchBar, setChangedBySearchBar] = useState(false);

	const [options, setOptions] = useState<Array<{ id: string; label: string; hasAvatar: false }>>(
		[]
	);

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
					...map(inputTyped?.split(' '), (item: string, id: number) => ({
						id: `${id}`,
						label: item,
						hasAvatar: false
					}))
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
						!!find(inputState, (c: QueryChip): boolean => c.label === qchip.label)
				)
			);
		});
		// if (activeRoute?.app !== SEARCH_APP_ID) {
		history.push(`/${SEARCH_APP_ID}/${module}`);
		// }
		setSearchIsEnabled(false);
		// setChangedBySearchBar(true);
	}, [updateQuery, history, module, inputTyped, inputState]);

	const appSuggestions = useMemo<Array<QueryChip & { hasAvatar: false }>>(
		() =>
			filter(storedValue, (v) => v.app === module)
				.reverse()
				.map((item: QueryChip) => ({
					...item,
					hasAvatar: false,
					disabled: searchDisabled,
					click: (): void => {
						setInputState((q: Array<QueryChip>) => [...q, { ...item, hasAvatar: false }]);
					}
				})),
		[storedValue, module, searchDisabled]
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
				module &&
				!find(appSuggestions, (v) => v.label === newQuery[newQuery.length - 1]?.label)
			) {
				setStoredValue((value) => [
					...value,
					{
						value: newQuery[newQuery.length - 1].label,
						label: newQuery[newQuery.length - 1].label,
						icon: 'ClockOutline',
						app: module,
						id: `${value.length}`,
						hasAvatar: false
					}
				]);
			}
			/** Commented for future reference */
			// if (inputRef.current) {
			// 	updateOptions(inputRef.current, newQuery);
			// }
			setInputState(newQuery);
			setSearchIsEnabled(true);
		},
		[appSuggestions, module, setStoredValue]
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
		if (module) {
			const suggestions = filter(appSuggestions, (suggestion) => suggestion?.app === module).slice(
				0,
				5
			);

			setOptions(suggestions);
		}
	}, [appSuggestions, module]);

	const [triggerSearch, setTriggerSearch] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const addFocus = useCallback(() => setInputHasFocus(true), []);
	const removeFocus = useCallback(() => setInputHasFocus(false), []);

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
				setTimeout(() => {
					setTriggerSearch(true);
					removeFocus();
				}, 0);
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
	}, [onSearch, removeFocus]);

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
			inputHasFocus && module
				? t('search.active_input_label', 'Separate your keywords by a comma or pressing TAB')
				: t('search.idle_input_label', 'Search in {{module}}', {
						module
				  }),
		[inputHasFocus, module, t]
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
		(newChip: string | unknown) => {
			setIsTyping(false);
			setInputTyped('');
			if (module) {
				const suggestions = filter(
					appSuggestions,
					(suggestion) => suggestion?.app === module
				).slice(0, 5);

				setOptions(suggestions);
			}
			return {
				label: typeof newChip === 'string' ? newChip.trim() : '',
				hasAvatar: false,
				avatarLabel: ''
			};
		},
		[appSuggestions, module]
	);

	useEffect(() => {
		setInputState(map(query, (q) => ({ ...q, disabled: searchDisabled })));
	}, [searchDisabled, query]);

	const disableClearButton = useMemo(() => (isTyping ? false : !showClear), [showClear, isTyping]);

	return (
		<Container width="fit" flexGrow="1" orientation="horizontal" minWidth="0" ref={containerRef}>
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
								<ModuleSelector activeRoute={activeRoute} disabled={searchDisabled} />
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
									onInputTypeDebounce={0}
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
								size="large"
								customSize={{
									iconSize: 'large',
									paddingSize: 'small'
								}}
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
