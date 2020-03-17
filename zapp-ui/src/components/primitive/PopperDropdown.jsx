import React, { useState, useRef, useEffect } from 'react';
import { createPopper } from '@popperjs/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Padding from './Padding';
import Icon from './Icon';
import Text from './Text';
import Container from './Container';

const PopperDropdownWrapper = styled.div`
	position: relative;
	display: inline-block;
`;

const PopperTriggerWrapper = styled.div`
	display: inline-block;
`;

const PopperList = styled.div`
	position: absolute;
	visibility: hidden;
	pointer-events: none;
	background-color: ${props => props.theme.colors.background['bg_9']};
	z-index: 4;
	
	max-width: 300px;
	max-height: 50vh;
	overflow-y: auto;
	
	&.active{
		visibility: visible;
		pointer-events: auto;
	}
`;

/**
 * @deprecated Use DropDown instead
 * @constructor
 */
function PopperDropdown({items, placement, children}) {
	const [open, setOpen] = useState(false);
	const [popperInstance, setPopperInstance] = useState(null);
	const dropdownRef = useRef(null);
	const triggerRef = useRef(null);

	const popperOptions = {
		placement: placement
	};

	const openPopper = () => {
		setOpen(true);
		setPopperInstance(createPopper(triggerRef.current, dropdownRef.current, popperOptions));
	};

	const closePopper = () => {
		if (popperInstance) {
			setOpen(false);
			popperInstance.destroy();
			setPopperInstance(null);
		}
	};

	useEffect(() => {
		if (open) {
			window.addEventListener('click', closePopper, { once: true });
		}
	}, [open]);

	return (
		<PopperDropdownWrapper>
			<PopperTriggerWrapper ref={triggerRef}>
				{React.cloneElement( children, {onClick: (e) => open ? closePopper() : openPopper()} )}
			</PopperTriggerWrapper>
			<PopperList ref={dropdownRef} className={open ? "active" : ""}>
				{items.map((item, index) => (
					<PopperListItem
						icon={item.icon}
						label={item.label}
						click={item.click}
						key={item.id}
					/>
				))}
			</PopperList>
		</PopperDropdownWrapper>
	);
}

PopperDropdown.propTypes = {
	/** Map of items to display */
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			icon: PropTypes.string,
			click: PropTypes.func
		})
	).isRequired,
	/** Only one component can be passed as children */
	children: PropTypes.element.isRequired,
	/** Placement of the dropdown */
	placement: PropTypes.oneOf([
		'auto',
		'auto-start',
		'auto-end',
		'top',
		'top-start',
		'top-end',
		'bottom',
		'bottom-start',
		'bottom-end',
		'right',
		'right-start',
		'right-end',
		'left',
		'left-start',
		'left-end'
	]),
};

PopperDropdown.defaultProps = {
	placement: 'bottom-start'
};

const ContainerEl = styled(Container)`
	&:focus{
		outline: 1px solid #eee;
	}
`;

/**
 * @deprecated Use DropDown instead
 * @constructor
 */
function PopperListItem({ icon, label, click }) {
	return (
		<ContainerEl
			orientation="horizontal"
			mainAlignment="flex-start"
			padding={{ vertical: 'small', horizontal: 'large' }}
			style={ { cursor: click ? 'pointer' :  'default'}}
			onClick={click}
			tabIndex={0}
		>
			{
				icon &&
				<Padding right="small">
					<Icon icon={icon} size="medium" color="txt_1" />
				</Padding>
			}
			<Text size="medium" weight="regular" color="txt_1">
				{label}
			</Text>
		</ContainerEl>
	);
}

export default PopperDropdown;
