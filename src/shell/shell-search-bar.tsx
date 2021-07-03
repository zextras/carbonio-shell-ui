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

import React, { FC, useState, useCallback, useEffect, useMemo } from 'react';
import { ChipInput, Container, Dropdown, IconButton, Tooltip } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { map, last, uniqWith, isEqual } from 'lodash';
import { useLocalStorage } from './hooks';

const searchResults = [
	{
		id: 'result1',
		icon: 'AvatarOutline',
		application: 'zapp-mails',
		label: 'result 1'
	},
	{
		id: 'result2',
		icon: 'AvatarOutline',
		application: 'zapp-mails',
		label: 'result 2'
	},
	{
		id: 'result3',
		icon: 'AvatarOutline',
		application: 'zapp-mails',
		label: 'result 3'
	},
	{
		id: 'result4',
		icon: 'AvatarOutline',
		application: 'zapp-mails',
		label: 'result 4'
	},
	{
		id: 'result5',
		icon: 'AvatarOutline',
		application: 'zapp-mails',
		label: 'result 5'
	}
];

type SearchBarProps = {
	currentApp: string;
	inputRef: any;
};

export function SearchBar({ currentApp, inputRef }: SearchBarProps): any {
	const [lastSearchesDropdownOpen, setLastSearchesDropdownOpen] = useState(false);
	const [resultsDropdownOpen, setResultsDropdownOpen] = useState(false);
	const [searchIconActive, setSearchIconActive] = useState(false);
	const [deleteIconActive, setDeleteIconActive] = useState(false);
	const [chipInputValue, setChipInputValue] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [t] = useTranslation();
	const [storedValue, setStoredValue] = useLocalStorage('shell', []);

	const searchBarPlaceholder = `Search in ${
		currentApp
			.slice(currentApp.lastIndexOf('_') + 1)
			.charAt(0)
			.toUpperCase() + currentApp.slice(currentApp.lastIndexOf('_') + 1).slice(1)
	}`;

	const addChip = useCallback(
		(item) => {
			if (inputRef.current) {
				inputRef.current.textContent = ''; // eslint-disable-line no-param-reassign
				inputRef.current.focus();
			}
			setChipInputValue((c): any => [...c, item]);
			setLastSearchesDropdownOpen(false);
		},
		[inputRef]
	);

	const lastSearches = useMemo(() => {
		const items =
			searchText === ''
				? [...storedValue]
						.filter((item: any) => item.id === currentApp)
						.reverse()
						.slice(0, 5)
				: [...storedValue]
						.filter((item: any) => item.id === currentApp && item.label.indexOf(searchText) !== -1)
						.slice(0, 5);
		return items;
	}, [searchText, currentApp, storedValue]);

	const onChipFocus = useCallback(() => {
		setSearchIconActive(true);
		setLastSearchesDropdownOpen(true);
	}, []);

	const onChipBlur = useCallback(() => {
		setSearchIconActive(false);
		setLastSearchesDropdownOpen(false);
	}, []);

	useEffect(() => {
		window.addEventListener('keypress', (event: any) =>
			event.key === 'Enter' && event.target.isContentEditable === false
				? inputRef.current.focus()
				: null
		);
	}, [inputRef]);

	const onType = (ev: any): any => {
		if (ev.textContent?.length > 0) {
			setDeleteIconActive(true);
		}
		setSearchText(ev.textContent);
	};

	const clearSearch = useCallback(() => {
		inputRef.current.innerText = ''; // eslint-disable-line no-param-reassign
		setChipInputValue([]);
		setLastSearchesDropdownOpen(false);
		setDeleteIconActive(false);
		setSearchIconActive(false);
		setSearchText('');
	}, [inputRef]);

	const valueToStore = useMemo(() => [...storedValue], [storedValue]);

	const onChipsChange = useCallback(
		(e) => {
			setChipInputValue(e);
			if (e.length) {
				valueToStore?.push({
					id: currentApp,
					label: last(map(e, (item) => item.value)),
					click: addChip(last(map(e, (item) => item.value)))
				});
			}
			const valueToStoreSorted = uniqWith(valueToStore, isEqual);
			setStoredValue(valueToStoreSorted);
		},
		[setStoredValue, valueToStore, addChip, currentApp]
	);

	return (
		<>
			<Container>
				<Tooltip label={t('type_start_search')} placement="bottom">
					<ChipInput
						inputRef={inputRef}
						placeholder={searchBarPlaceholder}
						confirmChipOnBlur={false}
						onInputType={onType}
						onChange={onChipsChange}
						onFocus={onChipFocus}
						onBlur={onChipBlur}
						value={chipInputValue}
						background="gray5"
						style={{
							cursor: 'pointer',
							height: '43px',
							backgroundColor: '#F5F6F8',
							bordeRadius: '2px 2px 0px 0px'
						}}
					/>
				</Tooltip>
				<Dropdown
					disablePortal={false}
					maxHeight="234px"
					disableAutoFocus
					disableRestoreFocus
					display="block"
					width="100%"
					maxWidth="100%"
					items={lastSearches}
					forceOpen={lastSearchesDropdownOpen}
				>
					<div style={{ width: '100%' }} />
				</Dropdown>
				<Dropdown
					disablePortal={false}
					maxHeight="500px"
					disableAutoFocus
					disableRestoreFocus
					display="block"
					width="100%"
					maxWidth="100%"
					items={searchResults}
					forceOpen={resultsDropdownOpen}
					onClose={(): any => setResultsDropdownOpen(false)}
				>
					<div style={{ width: '100%' }} />
				</Dropdown>
			</Container>
			<Tooltip label={t('clear_search')} placement="bottom">
				<IconButton
					icon="BackspaceOutline"
					style={{
						border: '1px solid #2b73d2',
						display: deleteIconActive || chipInputValue?.length > 0 ? 'block' : 'none',
						marginLeft: '4px',
						cursor: 'pointer'
					}}
					iconColor="primary"
					onClick={clearSearch}
				/>
			</Tooltip>
			<Tooltip label={t('start_search')} placement="bottom">
				<IconButton
					icon="Search"
					style={{
						border: searchIconActive ? '1px solid #2b73d2' : '1px solid #aac8ee',
						backgroundColor: searchIconActive ? '#2b73d2' : '#aac8ee',
						marginLeft: '8px',
						cursor: 'pointer'
					}}
					backgroundColor={searchIconActive ? 'primary' : 'transparent'}
					iconColor="gray6"
					onClick={(): any => {
						deleteIconActive || chipInputValue?.length > 0 ? setResultsDropdownOpen(true) : null;
					}}
				/>
			</Tooltip>
		</>
	);
}
