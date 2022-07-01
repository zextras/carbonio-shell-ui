/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC } from 'react';
import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	Catcher
} from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import Logo from '../svg/carbonio.svg';
import { SearchBar } from '../search/search-bar';
import { CreationButton } from './creation-button';
import { useAppStore } from '../store/app';
import { AppRoute } from '../../types';

const GridHeader = styled(Container)`
	grid-area: header;
`;

const ShellHeader: FC<{
	activeRoute: AppRoute;
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ activeRoute, mobileNavIsOpen, onMobileMenuClick, children }) => {
	const screenMode = useScreenMode();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	return (
		<GridHeader
			orientation="horizontal"
			background="gray3"
			width="fill"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Catcher>
				<Container
					orientation="horizontal"
					width="75%"
					maxWidth="75%"
					mainAlignment="space-between"
				>
					<Responsive mode="mobile">
						<Padding right="small">
							<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
						</Padding>
					</Responsive>
					<Container width={320} height={32} crossAlignment="flex-start">
						<Logo height="32px" />
					</Container>
					<Padding horizontal="large">
						<CreationButton activeRoute={activeRoute} />
					</Padding>
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
			</Catcher>
		</GridHeader>
	);
};
export default ShellHeader;
