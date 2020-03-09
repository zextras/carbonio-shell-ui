import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import Dropdown from './Dropdown';
import Container from "./Container";
import IconButton from "./IconButton";

export const DropdownButton = ({ items, label, icon, top, bottom, left, right }) => {
	const [open, setOpen] = useState(false);

	return (
		<Container orientation="vertical" width="fit" height="fit">
			<Button label={label} icon={ icon ? icon : "ArrowDown" } onClick={() => setOpen(!open)}/>
			<Dropdown
				items={items}
				open={open}
				top={top}
				bottom={bottom}
				left={left}
				right={right}
				closeFunction={() => setOpen(false)}
			/>
		</Container>
	);
};

export const IconDropdownButton = ({ items, icon, iconColor, top, bottom, left, right }) => {
	const [open, setOpen] = useState(false);

	return (
		<Container orientation="vertical" width="fit" height="fit">
			<IconButton iconColor={iconColor} icon={ icon ? icon : "Plus" } onClick={() => setOpen(!open)}/>
			<Dropdown
				items={items}
				open={open}
				top={top}
				bottom={bottom}
				left={left}
				right={right}
				closeFunction={() => setOpen(false)}
			/>
		</Container>
	);
};

DropdownButton.propTypes = {
	/** map of items to display */
	items: Dropdown.propTypes.items,
	/** Button text */
	label: PropTypes.string.isRequired,
	/** optional icon to display beside the label */
	icon: PropTypes.string,
	/** Dropdown positioning (CSS top property) */
	top: PropTypes.string,
	/** Dropdown positioning (CSS bottom property) */
	bottom: PropTypes.string,
	/** Dropdown positioning (CSS left property) */
	left: PropTypes.string,
	/** Dropdown positioning (CSS right property) */
	right: PropTypes.string
};

IconDropdownButton.propTypes = {
	/** map of items to display */
	items: Dropdown.propTypes.items,
	iconColor: IconButton.propTypes.iconColor,
	icon: PropTypes.string,
	/** Dropdown positioning (CSS top property) */
	top: PropTypes.string,
	/** Dropdown positioning (CSS bottom property) */
	bottom: PropTypes.string,
	/** Dropdown positioning (CSS left property) */
	left: PropTypes.string,
	/** Dropdown positioning (CSS right property) */
	right: PropTypes.string
};
