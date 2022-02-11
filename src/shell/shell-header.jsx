/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';
import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode
} from '@zextras/carbonio-design-system';
import Logo from '../svg/carbonio-beta.svg';
import LogoAdmin from '../svg/carbonio-admin-panel.svg';
import { SearchBar } from '../search/search-bar';
import { CreationButton } from './creation-button';
import { useAppStore } from '../store/app';
import { SHELL_MODES } from '../constants';
import { ShellMode } from '../multimode';

export default function ShellHeader({ activeRoute, mobileNavIsOpen, onMobileMenuClick, children }) {
	const screenMode = useScreenMode();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
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
				<Container width={320} height={32} crossAlignment="flex-start">
					<ShellMode exclude={[SHELL_MODES.ADMIN]}>
						<Logo height="32px" />
					</ShellMode>
					<ShellMode include={[SHELL_MODES.ADMIN]}>
						<LogoAdmin height="32px" />
					</ShellMode>
				</Container>
				<ShellMode exclude={[SHELL_MODES.ADMIN]}>
					<Padding horizontal="large">
						<CreationButton activeRoute={activeRoute} />
					</Padding>
				</ShellMode>
				<Responsive mode="desktop">
					{searchEnabled && (
						<SearchBar
							activeRoute={activeRoute}
							// primaryAction={primaryAction}
							// secondaryActions={secondaryActions}
						/>
					)}
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
						{/* <Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown> */}
					</Container>
				</Responsive>
			</Container>
		</Container>
	);
}
