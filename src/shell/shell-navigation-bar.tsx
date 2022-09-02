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

type ShellNavigationBarProps = {
	mobileNavIsOpen: boolean;
};

const ShellNavigationBar: FC<ShellNavigationBarProps> = ({ mobileNavIsOpen }) => (
	<Container
		orientation="horizontal"
		background="gray5"
		width="fit"
		height="fill"
		mainAlignment="flex-start"
		crossAlignment="flex-start"
	>
		<Responsive mode="desktop">
			<ShellPrimaryBar />
			<ShellSecondaryBar />
		</Responsive>
		<Responsive mode="mobile">
			<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} />
		</Responsive>
	</Container>
);

export default ShellNavigationBar;
