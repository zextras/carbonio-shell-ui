import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Responsive } from '@zextras/zapp-ui';
import ShellPrimaryBar from './shell-primary-bar';
import ShellSecondaryBar from './shell-secondary-bar';
import ShellMobileNav from './shell-mobile-nav';

export default function ShellNavigationBar({
	navigationBarIsOpen,
	mobileNavIsOpen,
	onCollapserClick
}) {
	const location = useLocation();
	const activeApp = useMemo(() => location.pathname.split('/')[1], [location.pathname]);
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
