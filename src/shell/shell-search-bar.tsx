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

import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { ChipInput, Container, IconButton, Tooltip, ThemeContext } from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { uniqWith, uniqBy, sortBy, isEqual, debounce } from 'lodash';
import styled from 'styled-components';
import { useLocalStorage } from './hooks';

const StyledContainer = styled(Container)`
	height: 42px;
	overflow-y: hidden;
	&:first-child {
		transform: translateY(-1px);
	}
`;

type SearchBarProps = {
	currentApp: string;
	inputRef: any;
};

export function SearchBar({ currentApp, inputRef }: SearchBarProps): any {
	const theme = useContext(ThemeContext) as unknown;
	const [searchIconActive, setSearchIconActive] = useState(false);
	const [deleteIconActive, setDeleteIconActive] = useState(false);
	const [chipInputValue, setChipInputValue] = useState([]);
	const [t] = useTranslation();
	const [storedValue, setStoredValue] = useLocalStorage('search_suggestions', []);
	const [options, setOptions] = useState<any>([]);

	const searchBarPlaceholder = `Search in ${
		currentApp
			.slice(currentApp.lastIndexOf('_') + 1)
			.charAt(0)
			.toUpperCase() + currentApp.slice(currentApp.lastIndexOf('_') + 1).slice(1)
	}`;

	const onChipFocus = (): any => {
		setSearchIconActive(true);
	};

	const onChipBlur = useCallback(() => {
		setSearchIconActive(false);
	}, []);

	useEffect(() => {
		window.addEventListener('keypress', (event: any) => {
			if (event.key === '/' && event.target.isContentEditable === false) {
				event.preventDefault();
				inputRef.current.focus();
			}
		});
	}, [inputRef]);

	const onType = useMemo(
		() =>
			debounce((ev: any): void => {
				if (ev.textContent?.length > 0) {
					setDeleteIconActive(true);
					const items =
						ev.textContent === ''
							? [...storedValue]
									.filter((item: any) => item.app === currentApp)
									.reverse()
									.slice(0, 5)
							: [...storedValue]
									.filter(
										(item: any) =>
											item.app === currentApp && item.label.indexOf(ev.textContent) !== -1
									)
									.slice(0, 5);
					setOptions(items.map((i) => ({ ...i, value: i.label })));
					return;
				}
				setOptions([]);
			}, 200),
		[currentApp, storedValue]
	);

	const clearSearch = (): void => {
		inputRef.current.innerText = ''; // eslint-disable-line no-param-reassign
		setChipInputValue([]);
		setDeleteIconActive(false);
		setSearchIconActive(false);
		inputRef.current.focus();
	};

	const onAdd = useCallback(
		(e: string): { label: string } => {
			setChipInputValue((c): any => [...c, { label: e }]);
			[...storedValue]?.push({
				id: `${storedValue.length}`,
				app: currentApp,
				label: e
			});
			const valueToStoreSorted = sortBy(
				uniqWith(
					uniqBy([...storedValue], 'label').concat(uniqBy([...storedValue], 'app')),
					isEqual
				),
				'id'
			);
			setStoredValue(valueToStoreSorted);
			return { label: e };
		},
		[currentApp, storedValue, setStoredValue]
	);

	return (
		<>
			<StyledContainer>
				<Tooltip label={t('type_start_search')} placement="bottom">
					<ChipInput
						inputRef={inputRef}
						placeholder={searchBarPlaceholder}
						confirmChipOnBlur={false}
						onInputType={onType}
						onFocus={onChipFocus}
						onAdd={onAdd}
						onBlur={onChipBlur}
						defaultValue={chipInputValue}
						options={options}
						background="gray5"
						style={{
							cursor: 'pointer',
							// @ts-ignore
							backgroundColor: theme.palette.gray5.regular,
							bordeRadius: '2px 2px 0px 0px'
						}}
					/>
				</Tooltip>
			</StyledContainer>
			<Tooltip label={t('clear_search')} placement="bottom">
				<IconButton
					icon="BackspaceOutline"
					style={{
						// @ts-ignore
						border: `1px solid ${theme.palette.primary.regular}`,
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
						border: searchIconActive
							? // @ts-ignore
							  `1px solid ${theme.palette.primary.regular}`
							: // @ts-ignore
							  `1px solid ${theme.palette.highlight.regular}`,
						backgroundColor: searchIconActive
							? // @ts-ignore
							  theme.palette.primary.regular
							: // @ts-ignore
							  theme.palette.highlight.regular,
						marginLeft: '8px',
						cursor: 'pointer'
					}}
					backgroundColor={searchIconActive ? 'primary' : 'transparent'}
					iconColor="gray6"
					onClick={null}
				/>
			</Tooltip>
		</>
	);
}
