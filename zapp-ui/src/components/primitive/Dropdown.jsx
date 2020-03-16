import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { map } from 'lodash';
import Icon from './Icon';
import Container from './Container';
import Text from './Text';
import Padding from './Padding';
import Collapse from '../utilities/Collapse';

const ContainerEl = styled(Container)`
	&:focus{
		outline: 1px solid #eee;
	}
`;

function DropdownItem({ icon, label, click }) {
	const onClick = useCallback((ev) => {
		ev.stopPropagation();
		click();
	}, [click]);
	return (
		<ContainerEl
			orientation="horizontal"
			mainAlignment="flex-start"
			padding={{ vertical: 'small', horizontal: 'large' }}
			style={ { cursor: click ? 'pointer' :  'default'}}
			onClick={onClick}
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

DropdownItem.propTypes = {
	/** The id of the menu item, must be unique for a group of items */ id: PropTypes.string.isRequired,
	/** The label of the menu item */ label: PropTypes.string.isRequired,
	/** The icon of the menu item */ icon: PropTypes.string,
	/** The callback invoked when the item is clicked */ click: PropTypes.func.isRequired
};

const DropdownContainer = styled.div`position: relative;`;

const DropdownContent = styled.div`
	position: absolute;
	${props => props.top && `top: ${props.top};`}
	${props => props.bottom && `bottom: ${props.bottom};`}
	${props => props.left && `left: ${props.left};`}
	${props => props.right && `right: ${props.right};`}
	z-index: 4;
`;

function Dropdown({ items, open, top, bottom, left, right, closeFunction }) {
	useEffect(
		() => {
			if (closeFunction && open) {
				window.addEventListener('click', closeFunction, { once: true });
			}
		},
		[open, closeFunction]
	);
	return (
		<DropdownContainer>
			<DropdownContent top={top} bottom={bottom} left={left} right={right}>
				<Collapse orientation="vertical" open={open}>
					<Container
						orientation="vertical"
						height="fit"
						width="128px"
						background="bg_9"
						padding={{ vertical: "small" }}
					>
						{
							map(
								items,
								(item) => (
									<DropdownItem
										key={item.id}
										icon={item.icon}
										label={item.label}
										click={item.click}
									/>
								)
							)
						}
					</Container>
				</Collapse>
			</DropdownContent>
		</DropdownContainer>
	);
}

Dropdown.propTypes = {
	/** map of items to display */
	items: PropTypes.arrayOf(
		PropTypes.shape(DropdownItem.propTypes)
	),
	/** Dropdown control prop */
	open: PropTypes.bool,
	/** Dropdown positioning (CSS top property) */
	top: PropTypes.string,
	/** Dropdown positioning (CSS bottom property) */
	bottom: PropTypes.string,
	/** Dropdown positioning (CSS left property) */
	left: PropTypes.string,
	/** Dropdown positioning (CSS right property) */
	right: PropTypes.string,
	/** Function that triggers the closing of the dropdown */
	closeFunction: PropTypes.func
};

export default Dropdown;
