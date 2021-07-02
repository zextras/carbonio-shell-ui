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

import React, { FC, useState, useCallback, useEffect } from 'react';
import { ChipInput, Container, Dropdown, IconButton, Tooltip } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';

const lastSearches = [
	{
		id: 'suggestion1',
		icon: 'HistoryOutline',
		application: 'zapp-mails',
		label: 'suggestion 1'
	},
	{
		id: 'suggestion2',
		icon: 'HistoryOutline',
		application: 'zapp-mails',
		label: 'suggestion 2'
	},
	{
		id: 'suggestion3',
		icon: 'HistoryOutline',
		application: 'zapp-mails',
		label: 'suggestion 3'
	},
	{
		id: 'suggestion4',
		icon: 'HistoryOutline',
		application: 'zapp-mails',
		label: 'suggestion 4'
	},
	{
		id: 'suggestion5',
		icon: 'HistoryOutline',
		application: 'zapp-mails',
		label: 'suggestion 5'
	}
];

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
	placeholder: string;
	disablePortal: boolean;
	inputRef: any;
};

export function SearchBar({ placeholder, disablePortal = false, inputRef }: SearchBarProps): any {
	const [forceOpenInput, setForceOpenInput] = useState(false);
	const [forceOpenResults, setForceOpenResults] = useState(false);
	const [inputChipSelected, setInputChipSelected] = useState(false);
	const [deleteIconActive, setDeleteIconActive] = useState(false);
	const [chipInputValue, setChipInputValue] = useState([]);
	const [t] = useTranslation();

	const onChipFocus = useCallback(() => {
		setInputChipSelected(true);
		deleteIconActive || lastSearches?.length > 0 || inputRef.current
			? setForceOpenInput(true)
			: setForceOpenInput(false);
	}, [deleteIconActive, inputRef]);

	useEffect(() => {
		window.addEventListener(
			'keypress',
			(event: any) => event.key === 'Enter' && event.target.isContentEditable === false
		);
	}, [inputRef]);

	const onType = (ev: any): any => {
		ev.textContent?.length > 0 ? setDeleteIconActive(true) : setDeleteIconActive(false);
		setForceOpenInput(false);
	};

	const clearSearch = useCallback(() => {
		inputRef.current.innerText = ''; // eslint-disable-line no-param-reassign
		setChipInputValue([]);
		setForceOpenInput(false);
		setDeleteIconActive(false);
		setInputChipSelected(false);
	}, [inputRef]);

	const onChipsChange = useCallback((c) => {
		setChipInputValue(c);
	}, []);

	useEffect(() => {
		if (
			(lastSearches?.length > 0 || inputRef.current || setDeleteIconActive) &&
			inputChipSelected
		) {
			setForceOpenInput(true);
		} else {
			setForceOpenInput(false);
		}
	}, [inputChipSelected, inputRef]);

	return (
		<>
			<Container>
				<Tooltip label={t('type-start_search')} placement="bottom">
					<ChipInput
						inputRef={inputRef}
						placeholder={placeholder}
						confirmChipOnBlur={false}
						onInputType={onType}
						onChange={onChipsChange}
						onFocus={onChipFocus}
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
					disablePortal={disablePortal}
					maxHeight="234px"
					disableAutoFocus
					disableRestoreFocus
					display="block"
					width="100%"
					maxWidth="100%"
					items={lastSearches}
					forceOpen={forceOpenInput}
					onClose={(): any => setForceOpenInput(false)}
				>
					<div style={{ width: '100%' }} />
				</Dropdown>
				<Dropdown
					disablePortal={disablePortal}
					maxHeight="500px"
					disableAutoFocus
					disableRestoreFocus
					display="block"
					width="100%"
					maxWidth="100%"
					items={searchResults}
					forceOpen={forceOpenResults}
					onClose={(): any => setForceOpenResults(false)}
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
						border: inputChipSelected ? '1px solid #2b73d2' : '1px solid #aac8ee',
						backgroundColor: inputChipSelected ? '#2b73d2' : '#aac8ee',
						marginLeft: '8px',
						cursor: 'pointer'
					}}
					backgroundColor={inputChipSelected ? 'primary' : 'transparent'}
					iconColor="gray6"
					onClick={(): any => {
						deleteIconActive || chipInputValue?.length > 0 ? setForceOpenResults(true) : null;
					}}
				/>
			</Tooltip>
		</>
	);
}
