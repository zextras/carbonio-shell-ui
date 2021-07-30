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
import { useHistory } from 'react-router-dom';
import { Container, Responsive } from '@zextras/zapp-ui';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick
}) {
	const history = useHistory();
	const activeApp = useMemo(() => history.location.pathname.split('/')[1], [
		history.location.pathname
	]);
	return (
		<Container
			orientation="horizontal"
			background="gray5"
			width="fit"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			<Responsive mode="desktop">
				<ShellPrimaryBar activeApp={activeApp} />
				<ShellSecondaryBar
					sidebarIsOpen={navigationBarIsOpen}
					onCollapserClick={onCollapserClick}
					activeApp={activeApp}
				/>
			</Responsive>
			<Responsive mode="mobile">
				<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} activeApp={activeApp} />
			</Responsive>
		</Container>
	);
}
