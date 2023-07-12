/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';

import { Responsive, Container } from '@zextras/carbonio-design-system';

import ShellMobileNav from './shell-mobile-nav';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import { IS_STANDALONE } from '../constants';

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
			{!IS_STANDALONE && <ShellPrimaryBar />}
			<ShellSecondaryBar />
		</Responsive>
		<Responsive mode="mobile">
			<ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} />
		</Responsive>
	</Container>
);

export default ShellNavigationBar;
