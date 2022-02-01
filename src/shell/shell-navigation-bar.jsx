/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import { Container, Responsive } from '@zextras/carbonio-design-system';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick,
	activeRoute
}) {
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
				<ShellPrimaryBar activeRoute={activeRoute} />
				<ShellSecondaryBar
					sidebarIsOpen={navigationBarIsOpen}
					onCollapserClick={onCollapserClick}
					activeRoute={activeRoute}
				/>
			</Responsive>
			<Responsive mode="mobile">
				<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} activeRoute={activeRoute} />
			</Responsive>
		</Container>
	);
}
