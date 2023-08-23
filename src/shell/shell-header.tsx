/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import {
	Catcher,
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode
} from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import { CreationButton } from './creation-button';
import { Logo } from './logo';
import { BOARD_CONTAINER_ZINDEX, HEADER_BAR_HEIGHT } from '../constants';
import { useDarkMode } from '../dark-mode/use-dark-mode';
import { SearchBar } from '../search/search-bar';
import { useAppStore } from '../store/app';

const StyledLogo = styled(Logo)`
	height: 2rem;
`;

const ShellHeaderContainer = styled(Container)`
	z-index: ${BOARD_CONTAINER_ZINDEX + 1};
`;

interface ShellHeaderProps {
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
	children: React.ReactNode | React.ReactNode[];
}

const ShellHeader = ({
	mobileNavIsOpen,
	onMobileMenuClick,
	children
}: ShellHeaderProps): JSX.Element => {
	const { darkReaderStatus } = useDarkMode();

	const screenMode = useScreenMode();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	return (
		<ShellHeaderContainer
			data-testid="MainHeaderContainer"
			orientation="horizontal"
			background={'gray3'}
			width="fill"
			height={HEADER_BAR_HEIGHT}
			minHeight={HEADER_BAR_HEIGHT}
			maxHeight={HEADER_BAR_HEIGHT}
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Catcher>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					minWidth="fit-content"
					data-testid="HeaderMainLogoContainer"
				>
					<Responsive mode="mobile">
						<Padding right="small">
							<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
						</Padding>
					</Responsive>
					<Container width="15.625rem" height="2rem" crossAlignment="flex-start">
						{darkReaderStatus && <StyledLogo />}
					</Container>
					<Padding horizontal="large">
						<CreationButton />
					</Padding>
					<Responsive mode="desktop">{searchEnabled && <SearchBar />}</Responsive>
				</Container>
				<Container orientation="horizontal" width="auto" mainAlignment="flex-end">
					<Responsive mode="desktop">{children}</Responsive>
				</Container>
			</Catcher>
		</ShellHeaderContainer>
	);
};
export default ShellHeader;
