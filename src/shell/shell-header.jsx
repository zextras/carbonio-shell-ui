/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, {
	useEffect,
	useState,
	useRef,
	useContext
} from 'react';
import { combineLatest } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { reduce } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Button,
	Container,
	Dropdown,
	IconButton,
	Logo,
	Padding,
	Responsive,
	Quota,
	useScreenMode
} from '@zextras/zapp-ui';
import { useAppsCache } from '../app/app-loader-context';
import { BoardSetterContext } from './boards/board-context';

export default function ShellHeader({
	userBarIsOpen,
	mobileNavIsOpen,
	onMobileMenuClick,
	onUserClick,
	quota
}) {
	const history = useHistory();
	const [ t ] = useTranslation();
	const screenMode = useScreenMode();
	const { cache } = useAppsCache();
	const { addBoard } = useContext(BoardSetterContext);
	const [createOptions, setCreateOptions] = useState([]);
	const refCreateOptions = useRef(createOptions);

	useEffect(() => {
		const subscription = combineLatest(
			reduce(
				cache,
				(acc, app) => {
					acc.push(
						app.createOptions.pipe(
							rxMap((items) => ({ items, app }))
						)
					);
					return acc;
				},
				[]
			)
		)
			.subscribe((_createOptions) => {
				setCreateOptions(
					reduce(
						_createOptions,
						(acc, { items, app }) => {
							reduce(
								items,
								(r, option) => {
									if (refCreateOptions.current.filter((op) => op.id === option.id).length === 0) {
										r.push({
											id: option.id,
											label: option.label,
											icon: option.icon,
											click: () => {
												if (window.top.location.pathname.startsWith(`/${app.pkg.package}`)) {
													history.push(`/${app.pkg.package}${(option.app.getPath && option.app.getPath()) || option.app.path}`);
												}
												else {
													addBoard(`/${app.pkg.package}${option.app.boardPath || option.app.path}`, option.label);
												}
												option.onClick && option.onClick();
											}
										});
									}
									return r;
								},
								acc
							);
							return acc;
						},
						[]
					)
				);
			});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [cache, addBoard, setCreateOptions, history]);

	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="fit"
			mainAlignment="space-between"
			padding={{ vertical: 'extrasmall', left: screenMode === 'desktop' ? 'extralarge' : 'extrasmall' }}
		>
			<Container orientation="horizontal" width="fit" mainAlignment="flex-start">
				<Responsive mode="mobile">
					<Padding right="small"><IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} /></Padding>
				</Responsive>
				<Logo size="small" />
			</Container>
			<Responsive mode="desktop">
				<Container orientation="horizontal" width="calc(100vw - 316px)">
					<Container orientation="horizontal" mainAlignment="flex-start" width="50%">
						<Container orientation="horizontal" width="fit" padding={{ right: 'small' }}>
							<Dropdown items={createOptions} placement="bottom-end">
								<Button label={t('new')} icon="ArrowIosDownwardOutline" />
							</Dropdown>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container orientation="horizontal" width="50%" mainAlignment="flex-end" padding={{ right: 'extrasmall' }}>
						<Padding right="small">
							<Quota fill={quota} />
						</Padding>
						<IconButton icon="BellOutline" iconColor="text" />
						<IconButton icon={userBarIsOpen ? 'Close' : 'PersonOutline'} iconColor="text" onClick={onUserClick} />
					</Container>
				</Container>
			</Responsive>
			<Responsive mode="mobile">
				<Container orientation="horizontal" mainAlignment="flex-end" padding={{ right: 'extrasmall' }}>
					{/* <IconButton icon="Search" /> */}
					<Dropdown items={createOptions} placement="bottom-start">
						<IconButton icon="Plus" />
					</Dropdown>
				</Container>
			</Responsive>
		</Container>
	);
}
