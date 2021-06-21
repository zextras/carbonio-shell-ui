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
import React, { useMemo } from 'react';
import { reduce, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Dropdown,
	IconButton,
	Logo,
	Padding,
	Responsive,
	useScreenMode,
	MultiButton
} from '@zextras/zapp-ui';
import { UserQuota } from './user-quota';
import { useAppStore } from '../app-store';

export default function ShellHeader({
	userBarIsOpen,
	mobileNavIsOpen,
	onMobileMenuClick,
	onUserClick
}) {
	const history = useHistory();
	const [t] = useTranslation();
	const screenMode = useScreenMode();
	const currentApp = useMemo(() => history.location.pathname.split('/')[1], [
		history.location.pathname
	]);
	const [primaryAction, secondaryActions] = useAppStore((s) => [
		s.apps[currentApp]?.newButton?.primary,
		reduce(
			s.apps,
			(acc, app, key) => {
				if (app.newButton?.secondaryItems) {
					if (acc.length > 0) {
						acc.push({ type: 'divider', id: key, key });
					}
					acc.push(
						...map(app.newButton?.secondaryItems, (item) => ({
							...item,
							key: item.id,
							disabled: item.disabled || item.getDisabledState?.()
						}))
					);
				}
				return acc;
			},
			[]
		)
	]);

	const isMultiButtonDisabled = useMemo(
		() => !!primaryAction || primaryAction?.disabled || primaryAction?.getDisabledState?.(),
		[primaryAction]
	);

	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="fit"
			mainAlignment="space-between"
			padding={{
				vertical: 'extrasmall',
				left: screenMode === 'desktop' ? 'extralarge' : 'extrasmall'
			}}
		>
			<Container orientation="horizontal" width="fit" mainAlignment="flex-start">
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Logo size="small" />
			</Container>
			<Responsive mode="desktop">
				<Container orientation="horizontal" width="calc(100vw - 316px)">
					<Container orientation="horizontal" mainAlignment="flex-start" width="50%">
						<Container orientation="horizontal" width="fit" padding={{ right: 'small' }}>
							<MultiButton
								background="primary"
								label={t('new', 'New')}
								onClick={primaryAction?.click}
								items={secondaryActions}
								disabled={isMultiButtonDisabled}
							/>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container
						orientation="horizontal"
						width="50%"
						mainAlignment="flex-end"
						padding={{ right: 'extrasmall' }}
					>
						<Padding right="small">
							<UserQuota />
						</Padding>
						<IconButton icon="BellOutline" iconColor="text" />
						<IconButton
							icon={userBarIsOpen ? 'Close' : 'PersonOutline'}
							iconColor="text"
							onClick={onUserClick}
						/>
					</Container>
				</Container>
			</Responsive>
			<Responsive mode="mobile">
				<Container
					orientation="horizontal"
					mainAlignment="flex-end"
					padding={{ right: 'extrasmall' }}
				>
					{/* <IconButton icon="Search" /> */}
					<Dropdown items={secondaryActions} placement="bottom-start">
						<IconButton icon="Plus" />
					</Dropdown>
				</Container>
			</Responsive>
		</Container>
	);
}
