/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Catcher,
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode
} from '@zextras/carbonio-design-system';
import React, { FC } from 'react';
import { SearchBar } from '../search/search-bar';
import { useAppStore } from '../store/app';
import Logo from '../svg/carbonio.svg';
import { CreationButton } from './creation-button';

const ShellHeader: FC<{
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ mobileNavIsOpen, onMobileMenuClick, children }) => {
	const screenMode = useScreenMode();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	return (
		<Container
			orientation="horizontal"
			background="gray1"
			width="fill"
			height="60px"
			minHeight="60px"
			maxHeight="60px"
			mainAlignment="flex-start"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Catcher>
				<Container orientation="horizontal" width="75%" maxWidth="75%" mainAlignment="flex-start">
					<Responsive mode="mobile">
						<Padding right="small">
							<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
						</Padding>
					</Responsive>
					<Container width={150} height={32} crossAlignment="flex-start">
						<Padding right="large" />
						<Logo height="32px" />
					</Container>
					<Padding horizontal="large">
						<CreationButton />
					</Padding>
					<Responsive mode="desktop">{searchEnabled && <SearchBar />}</Responsive>
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
		</Container>
	);
};
export default ShellHeader;
