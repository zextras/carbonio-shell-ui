/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container as ContainerMUI, Grid } from '@mui/material';
import { Catcher, Container, IconButton, Padding } from '@zextras/carbonio-design-system';
import React, { FC } from 'react';
import { SearchBar } from '../search/search-bar';
import { useAppStore } from '../store/app';
import Logo from '../svg/carbonio.svg';
import { themeMui as theme } from '../theme-mui/theme';
import { BREAKPOINT_SIZE, useMobileView } from '../utils/utils';
import { CreationButton } from './creation-button';

const ShellHeader: FC<{
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ mobileNavIsOpen, onMobileMenuClick, children }) => {
	const isMobileView = useMobileView();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	return (
		<Grid
			container
			// direction="row"
			sx={{
				backgroundColor: theme.palette.gray3.regular,
				minWidth: '100%',
				maxHeight: '60px',
				minHeight: '60px',
				display: 'flex-start',
				// flex: '0 0 auto',
				alignItems: 'center'
			}}
		>
			<Catcher>
				<Grid
					item
					xxs={BREAKPOINT_SIZE.XXS}
					xs={BREAKPOINT_SIZE.XS}
					sm={BREAKPOINT_SIZE.SM}
					md={BREAKPOINT_SIZE.MD}
					lg={BREAKPOINT_SIZE.LG}
					xl={BREAKPOINT_SIZE.XL}
					sx={{
						height: '100%',
						width: '100%',
						alignItems: 'center',
						display: 'flex',
						padding: `${theme.sizes.padding.small} ${theme.sizes.padding.large}`
					}}
				>
					{isMobileView && (
						<Padding right="small">
							<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
						</Padding>
					)}
					<Container width={250} height={32} crossAlignment="flex-start">
						<Padding vertical="large">
							<Logo height="32px" />
						</Padding>
					</Container>
				</Grid>
				<Grid
					item
					md
					sm
					xs
					sx={{
						height: '100%',
						width: '100%',
						display: isMobileView ? 'none' : 'flex',
						// display: 'flex',
						alignItems: 'center',
						justifyContent: 'flex-start'
					}}
					display={isMobileView ? 'none' : 'block'}
					// display={'block'}
				>
					<ContainerMUI
						disableGutters
						sx={{
							display: 'flex',
							minWidth: '100%',
							margin: 0,
							justifyContent: 'flex-start',
							spacing: 10
						}}
					>
						<CreationButton />
						{!isMobileView && searchEnabled && <SearchBar />}
					</ContainerMUI>
				</Grid>
				<Grid item md={1} sm={1}>
					<ContainerMUI
						disableGutters
						sx={{
							display: isMobileView ? 'none' : 'flex',
							justifyContent: 'end'
						}}
					>
						<Padding right="large" width="fill">
							{!isMobileView && children}
						</Padding>
						{/* {isMobile &&  ( */}
						{/* <Container */}
						{/*	orientation="horizontal" */}
						{/*	mainAlignment="flex-end" */}
						{/*	padding={{ right: 'extrasmall' }} */}
						{/* > */}
						{/* <Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown> )} */}
					</ContainerMUI>
				</Grid>
			</Catcher>
		</Grid>
	);
};
export default ShellHeader;
