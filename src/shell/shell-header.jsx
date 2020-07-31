/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import React, { useEffect, useState, useRef, useContext } from 'react';
import { map, reduce } from 'lodash';
import { useHistory } from 'react-router-dom';
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
import { useTranslation } from '../i18n/hooks';
import { useAppsCache } from '../app/app-loader-context';
import ShellContext from './shell-context';

export default function ShellHeader({
	userBarIsOpen,
	mobileNavIsOpen,
	onMobileMenuClick,
	onUserClick,
	quota
}) {
	const history = useHistory();
	const { t } = useTranslation();
	const screenMode = useScreenMode();
	const [appsCache, appsLoaded] = useAppsCache();
	const { addBoard } = useContext(ShellContext);
	const [createOptions, setCreateOptions] = useState([]);
	const refCreateOptions = useRef(createOptions);

	useEffect(() => {
		const subscriptions = map(appsCache, (app) => {
			return app.createOptions.subscribe((options) => {
				setCreateOptions(
					reduce(
						options,
						(r, option, k) => {
							if (refCreateOptions.current.filter(op => op.id === option.id).length === 0) {
								r.push({
									id: option.id,
									label: option.label,
									icon: option.icon,
									click: () => {
										if (window.top.location.pathname.startsWith(`/${app.pkg.package}`)) {
											history.push(`/${app.pkg.package}` + (option.app.getPath && option.app.getPath() || option.app.path));
										}
										else {
											addBoard(`/${app.pkg.package}` + (option.app.boardPath || option.app.path), option.label);
										}
										option.onClick && option.onClick();
									}
								});
							}
							return r;
						},
						[]
					)
				);
			});
		});
		return () => {
			subscriptions.forEach((subscription) => {
				subscription.unsubscribe();
			});
		}
	}, [appsCache, addBoard, history]);

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
								<Button label={t("New")} icon="ArrowIosDownwardOutline" />
							</Dropdown>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container orientation="horizontal" width="50%" mainAlignment="flex-end" padding={{ right: 'extrasmall'}}>
						<Padding right="small">
							<Quota fill={quota}/>
						</Padding>
						<IconButton icon="BellOutline" iconColor="text" />
						<IconButton icon={ userBarIsOpen ? 'Close' : 'PersonOutline' } iconColor="text" onClick={onUserClick}/>
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
