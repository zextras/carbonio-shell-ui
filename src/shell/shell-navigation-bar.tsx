/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container } from '@zextras/carbonio-design-system';
import React, { FC } from 'react';
import { AppRoute } from '../../types';
import { useMobileView } from '../utils/utils';
import ShellMobileNav from './shell-mobile-nav';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';

type ShellNavigationBarProps = {
	mobileNavIsOpen: boolean;
	activeRoute: AppRoute;
};
const ShellNavigationBar: FC<ShellNavigationBarProps> = ({ mobileNavIsOpen, activeRoute }) => {
	const isMobileView = useMobileView();
	const isSearchView = activeRoute?.app === 'search';
	return (
		<Container
			orientation="horizontal"
			background="gray5"
			width="fill"
			height="fill"
			mainAlignment="flex-start"
			crossAlignment="flex-start"
		>
			{!isMobileView && <ShellPrimaryBar />}
			{!isSearchView && <ShellSecondaryBar />}

			{isMobileView && <ShellMobileNav mobileNavIsOpen={mobileNavIsOpen} />}
		</Container>
	);
};
export default ShellNavigationBar;
