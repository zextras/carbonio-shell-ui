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
import React, { useEffect, useMemo, useState } from 'react';
import { reduce, map, find } from 'lodash';
import { useLocation } from 'react-router-dom';
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
import { useAppStore } from '../store/app/store';
import { SearchBar } from '../search/search-bar';

export default function ShellHeader({ mobileNavIsOpen, onMobileMenuClick, children }) {
	const location = useLocation();
	const [t] = useTranslation();
	const screenMode = useScreenMode();
	const xcurrentAppRoute = useMemo(() => location.pathname.split('/')[1], [location.pathname]);
	const [currentAppRoute, setCurrentAppRoute] = useState(() => location.pathname.split('/')[1]);
	useEffect(() => {
		setCurrentAppRoute((old) => {
			const next = location.pathname.split('/')[1];
			return next === old ? old : next;
		});
	}, [location.pathname]);

	useEffect(() => {
		console.log('memo', xcurrentAppRoute);
	}, [xcurrentAppRoute]);
	useEffect(() => {
		console.log('state', currentAppRoute);
	}, [currentAppRoute]);

	const [primaryAction, secondaryActions] = useAppStore((s) => {
		const currentApp = find(s.apps, (a) => a.core.route === currentAppRoute);
		return [
			currentApp?.newButton?.primary,
			reduce(
				s.apps,
				(acc, app, key) => {
					if (app.newButton?.secondaryItems) {
						if (acc.length > 0) {
							acc.push({ type: 'divider', id: key, key, label: 'really?' });
						}
						if (app.newButton?.primary) {
							acc.push(app.newButton?.primary);
						}
						acc.push(
							...map(app.newButton?.secondaryItems, (item) => ({
								...item,
								key: item.id,
								disabled: item.disabled || item.getDisabledStatus?.()
							}))
						);
					}
					return acc;
				},
				[]
			)
		];
	});

	const isMultiButtonDisabled = useMemo(
		() => !!primaryAction || primaryAction?.disabled || primaryAction?.getDisabledState?.(),
		[primaryAction]
	);

	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="60px"
			minHeight="60px"
			maxHeight="60px"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Container orientation="horizontal" width="75%" maxWidth="75%" mainAlignment="space-between">
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Logo size="large" style={{ minWidth: '160px' }} />
				<Padding horizontal="large">
					<MultiButton
						style={{ height: '44px' }}
						background="primary"
						label={t('new', 'New')}
						onClick={primaryAction?.click}
						items={secondaryActions}
						disabled={isMultiButtonDisabled}
					/>
				</Padding>
				<Responsive mode="desktop">
					<SearchBar
						currentApp={currentAppRoute}
						primaryAction={primaryAction}
						secondaryActions={secondaryActions}
					/>
				</Responsive>
			</Container>
			<Container orientation="horizontal" width="25%" mainAlignment="flex-end">
				<Responsive mode="desktop">{children}</Responsive>
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
		</Container>
	);
}
