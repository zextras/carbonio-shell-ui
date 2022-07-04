/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import { Responsive, Container } from '@zextras/carbonio-design-system';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ShellMobileNav from './shell-mobile-nav';
import { AppRoute } from '../../types';

type ShellNavigationBarProps = {
	mobileNavIsOpen: boolean;
	activeRoute: AppRoute;
};

const ShellNavigationBar: FC<ShellNavigationBarProps> = ({ mobileNavIsOpen, activeRoute }) => (
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
			<ShellSecondaryBar activeRoute={activeRoute} />
		</Responsive>
		<Responsive mode="mobile">
			<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} menuTree={activeRoute} />
		</Responsive>
	</Container>
);

export default ShellNavigationBar;
