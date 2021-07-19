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

import React, { useContext, useState, useCallback, useEffect, useMemo, FC } from 'react';
import {
	ChipInput,
	Container,
	IconButton,
	Tooltip,
	ThemeContext,
	Select,
	Row,
	Icon,
	Text
} from '@zextras/zapp-ui';
import { useTranslation } from 'react-i18next';
import { uniqWith, uniqBy, sortBy, isEqual, debounce, reduce, filter, find } from 'lodash';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLocalStorage } from './hooks';
import { SEARCH_APP_ID } from '../constants';
import { useApps } from '../app-store/hooks';
import { AppData, AppsMap } from '../app-store/store-types';

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

const SelectLabelFactory: FC<SelectLabelFactoryProps> = ({ selected, open, focus }) => (
	<Container
		orientation="horizontal"
		background="gray5"
		width="fill"
		crossAlignment="center"
		mainAlignment="space-between"
		borderRadius="half"
		padding={{
			vertical: 'small'
		}}
	>
		<Row takeAvailableSpace mainAlignment="unset">
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
	const history = useHistory();
	const apps = useApps();
	const searchBarPlaceholder = useMemo(() => t('search.in', { app: apps[currentApp]?.core.name }), [
		apps,
		currentApp,
		t
	]);

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

	const onSearch = useCallback(() => {
		history.push(
			`/${SEARCH_APP_ID}/${currentApp}?query=${chipInputValue
				.reduce(
					(acc: string, val: { label: string }) =>
						// eslint-disable-next-line no-useless-escape
						`${acc}${val.label.split(' ').length > 1 ? `\\"${val.label}\\"` : val.label} `,
					''
				)
				.trim()}`
		);
	}, [chipInputValue, currentApp, history]);

	const moduleSelectorItems = useMemo(
		() =>
			filter(apps, (app) => !!app.views?.search).map((app) => ({
				label: app.core.name,
				value: app.core.package
			})),
		[apps]
	);

	const [selectedModule, setSelectedModule] = useState(
		find(moduleSelectorItems, ['value', currentApp]) ?? moduleSelectorItems[0]
	);
	const onSelectChange = useCallback(
		(value: string): void =>
			setSelectedModule(find(moduleSelectorItems, ['value', value]) ?? moduleSelectorItems[0]),
		[moduleSelectorItems]
	);
	useEffect(() => {
		setSelectedModule(find(moduleSelectorItems, ['value', currentApp]) ?? moduleSelectorItems[0]);
	}, [currentApp, moduleSelectorItems]);

	return (
		<>
			<StyledContainer orientation="horizontal">
				<Container width="40%" padding={{ left: 'small' }}>
					<Select
						items={moduleSelectorItems}
						defaultSelection={selectedModule}
						background="gray6"
						label={t('search.module', 'Module')}
						onChange={onSelectChange}
						LabelFactory={SelectLabelFactory}
					/>
				</Container>
				<Tooltip
					label={t('search.type_start', 'Type one or more keywords to start a search')}
					placement="bottom"
				>
					<ChipInput
						inputRef={inputRef}
						placeholder={t('search.input_label', 'Search')}
						onInputType={onType}
						onFocus={onChipFocus}
						onAdd={onAdd}
						onBlur={onChipBlur}
						defaultValue={chipInputValue}
						confirmChipOnBlur
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
			<Tooltip label={t('search.clear', 'Clear search')} placement="bottom">
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
			<Tooltip label={t('search.start', 'Start search')} placement="bottom">
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
					onClick={onSearch}
				/>
			</Tooltip>
		</>
	);
}
