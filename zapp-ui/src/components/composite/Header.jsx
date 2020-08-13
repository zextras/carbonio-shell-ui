import React from 'react';
import PropTypes from 'prop-types';
import Container from "../layout/Container";
import { useScreenMode } from "../../hooks/useScreenMode";
import Logo from "../basic/Logo";
import IconButton from "../inputs/IconButton";
import Padding from "../layout/Padding";
import Quota from "../feedback/Quota";
import Dropdown from "../display/Dropdown";
import Button from "../basic/Button";
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
			background="header"
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
							<Dropdown items={createItems}>
								<Button label="CREATE" icon="ArrowDown" />
							</Dropdown>
						</Container>
						{/*	<SearchInput/> */}
					</Container>
					<Container orientation="horizontal" width="50%" mainAlignment="flex-end" padding={{ right: 'extrasmall'}}>
						<Padding right="small">
							<Quota fill={quota}/>
						</Padding>
						<IconButton icon="BellOutline" iconColor="text" />
						<IconButton icon={ userBarIsOpen ? 'Close' : 'PersonOutline' } iconColor="text" onClick={onUserClick}/>
					</Container>
				</Container>
			</Responsive>
			<Responsive mode="mobile">
				<Container orientation="horizontal" mainAlignment="flex-end" padding={{ right: 'extrasmall' }}>
					{/* <IconButton icon="Search" /> */}
					<Dropdown items={createItems} placement="bottom-start">
						<IconButton icon="Plus" />
					</Dropdown>
				</Container>
			</Responsive>
		</Container>
	);
}

Header.propTypes = {
	createItems: Dropdown.propTypes.items,
	quota: PropTypes.number.isRequired,
	onMenuClick: PropTypes.func.isRequired,
	onUserClick: PropTypes.func.isRequired,
	navigationBarIsOpen: PropTypes.bool.isRequired,
	userBarIsOpen: PropTypes.bool.isRequired,
};

export default Header;
