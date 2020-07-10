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
	navigationBarIsOpen,
	onMenuClick,
	onUserClick
}) {
	const { t } = useTranslation();
	const screenMode = useScreenMode();
	const [appsCache, appsLoaded] = useAppsCache();
	const { addPanel } = useContext(ShellContext);
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
										option.panel && addPanel(`/${app.pkg.package}${option.panel.path}`);
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
	}, [appsCache]);

	return (
		<Container
			orientation="horizontal"
			background="header"
			width="fill"
			height="fit"
			mainAlignment="space-between"
			padding={{ vertical: 'extrasmall', left: screenMode === 'desktop' ? 'extralarge' : 'extrasmall' }}
		>
			<Container orientation="horizontal" width="fit" mainAlignment="flex-start">
				<Responsive mode="mobile">
					<IconButton icon={navigationBarIsOpen ? 'Close' : 'Menu'} onClick={onMenuClick} />
				</Responsive>
				<Logo size="small" />
			</Container>
			<Responsive mode="desktop">
				<Container orientation="horizontal" width="calc(100vw - 316px)">
					<Container orientation="horizontal" mainAlignment="flex-start" width="50%">
						<Container orientation="horizontal" width="fit" padding={{ right: 'small' }}>
							<Dropdown items={createOptions} placement="bottom-end">
								<Button label={t("CREATE")} icon="ArrowIosDownwardOutline" />
							</Dropdown>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container orientation="horizontal" width="50%" mainAlignment="flex-end" padding={{ right: 'extrasmall'}}>
						<Padding right="small">
							<Quota fill={50}/>
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
