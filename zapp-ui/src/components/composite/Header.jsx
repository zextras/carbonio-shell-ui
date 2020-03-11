import React from 'react';
import PropTypes from 'prop-types';
import Container from "../primitive/Container";
import { useScreenMode } from "../../hooks/useScreenMode";
import Logo from "../primitive/Logo";
import IconButton from "../primitive/IconButton";
import Padding from "../primitive/Padding";
import { DropdownButton, IconDropdownButton } from "../primitive/DropdownButton";
import Quota from "../primitive/Quota";
import Responsive from "../utilities/Responsive";

function Header({
	createItems,
	quota,
	onMenuClick,
	onUserClick,
	navigationBarIsOpen,
	userBarIsOpen
}) {
	const screenMode = useScreenMode();
	return (
		<Container
			orientation="horizontal"
			background="bg_8"
			width="fill"
			height="fit"
			mainAlignment="space-between"
			padding={{ vertical: 'extrasmall', left: screenMode === 'desktop' ? 'extralarge' : 'extrasmall' }}
		>
			<Container orientation="horizontal" width="fit" mainAlignment="flex-start">
				<Responsive mode="mobile">
					<IconButton icon={navigationBarIsOpen ? 'Close' : 'Menu'} onClick={onMenuClick} />
				</Responsive>
				<Logo size="small" />
			</Container>
			<Responsive mode="desktop">
				<Container orientation="horizontal" width="calc(100vw - 332px)">
					<Container orientation="horizontal" mainAlignment="flex-start" width="50%">
						<Container orientation="horizontal" width="fit" padding={{ right: 'small' }}>
							<DropdownButton label="CREATE" items={createItems} left="-52px"/>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container orientation="horizontal" width="50%" mainAlignment="flex-end" padding={{ right: 'extrasmall'}}>
						<Padding right="small">
							<Quota fill={quota}/>
						</Padding>
						<IconButton icon="BellOutline" iconColor="txt_1" />
						<IconButton icon={ userBarIsOpen ? 'Close' : 'PersonOutline' } iconColor="txt_1" onClick={onUserClick}/>
					</Container>
				</Container>
			</Responsive>
			<Responsive mode="mobile">
				<Container orientation="horizontal" mainAlignment="flex-end" padding={{ right: 'extrasmall' }}>
					{/* <IconButton icon="Search" /> */}
					<IconDropdownButton label="CREATE" items={createItems} right="-20px" />
				</Container>
			</Responsive>
		</Container>
	);
}

Header.propTypes = {
	createItems: DropdownButton.propTypes.items,
	quota: PropTypes.number.isRequired,
	onMenuClick: PropTypes.func.isRequired,
	onUserClick: PropTypes.func.isRequired,
	navigationBarIsOpen: PropTypes.bool.isRequired,
	userBarIsOpen: PropTypes.bool.isRequired,
};

export default Header;
