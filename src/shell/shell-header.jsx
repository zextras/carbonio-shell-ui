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
import React, { useMemo, useRef } from 'react';
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
import { SearchBar } from './shell-search-bar';
import { useCSRFToken } from '../store/shell-store-hooks';

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

	const csrfToken = useCSRFToken();

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

	const inputRef = useRef();

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
			<Container
				orientation="horizontal"
				width="fill"
				mainAlignment="space-between"
				style={{ maxWidth: '288px' }}
			>
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Container orientation="horizontal" width="fill" mainAlignment="space-between">
					<Logo size="small" />
					<MultiButton
						style={{ marginLeft: 'auto' }}
						background="primary"
						label={t('new', 'New')}
						onClick={primaryAction?.click}
						items={secondaryActions}
						disabled={isMultiButtonDisabled}
					/>
				</Container>
			</Container>
			<Responsive mode="desktop">
				<Container orientation="horizontal" width="calc(100vw - 316px)">
					<Container orientation="horizontal" mainAlignment="flex-start" width="40%">
						{(currentApp.indexOf('mails') !== -1 ||
							currentApp.indexOf('contacts') !== -1 ||
							currentApp.indexOf('calendar') !== -1) && (
							<SearchBar inputRef={inputRef} currentApp={currentApp} csrfToken={csrfToken} />
						)}
					</Container>
					<Container
						orientation="horizontal"
						width="60%"
						mainAlignment="flex-end"
						padding={{ right: 'extrasmall' }}
					>
						<Padding right="small">
							{/* <ContactInput /> */}
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
					<Dropdown items={secondaryActions} placement="bottom-start">
						<IconButton icon="Plus" />
					</Dropdown>
				</Container>
			</Responsive>
		</Container>
	);
}
