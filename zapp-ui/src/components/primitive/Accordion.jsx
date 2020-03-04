import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Container from "./Container";
import Text from "./Text";
import Divider from "./Divider";
import Icon from "./Icon";
import Collapse from "../utilities/Collapse";
import Padding from "./Padding";

const Accordion = ({ label, items, icon, divider, level, click }) => {
	const [open, setOpen] = useState(false);
	return (
		<Container
			orientation="vertical"
			width="fill"
			height="fit"
			padding={level > 0 ? { left: 'medium'} : {}}
		>
			<Container
				style={ { cursor: click ? 'pointer' :  'default'}}
				onClick={(ev) => {
					setOpen(true);
					if (click) click(ev);
				}}
				orientation="horizontal"
				width="fill"
				height="fit"
				mainAlignment="space-between"
				padding={{ vertical: 'medium', horizontal: 'extralarge' }}
			>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					padding={{ right: 'small' }}
					style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
				>
					{ icon &&
					<Padding right="small">
						<Icon icon={icon}/>
					</Padding>
					}
					<Text size="large">{label}</Text>
				</Container>
				{ items
				&& items.length > 0
				&& <Icon
							size="medium"
							onClick={(ev) => {
								ev.stopPropagation();
								setOpen(!open);
							}}
							icon={ open ? 'ChevronUp' : 'ChevronDown'}
							style={{ cursor: 'pointer' }}
						/>
				}
			</Container>
			<Collapse
				crossSize="100%"
			  orientation="vertical"
				open={open}
				maxSize={`${items.length * 64}px`}
			>
				<Container
					orientation="vertical"
					height="fit"
					width="fill"
					crossAlignment="flex-start"
				>
					{ items
					&& items.length > 0
					&& items.map((item, index) => item.items && item.items.length > 0
						? <Accordion level={level + 1} key={index} click={item.click} label={item.label} icon={item.icon} items={item.items}/>
						: <AccordionItem level={level + 1} key={index} label={item.label} click={item.click} icon={item.icon}/>
					)}
				</Container>
			</Collapse>
			{ divider && <Divider color="bd_1"/>}
		</Container>
	);
};

Accordion.propTypes = {
	/** The label of the accordion */
	label: PropTypes.string.isRequired,
	/** Optional, the name of the icon to display next to the label */
	icon: PropTypes.string,
	/** Items tree object, can be nested */
	items: PropTypes.arrayOf(PropTypes.shape({label: PropTypes.string, click: PropTypes.func, icon: PropTypes.string, items: PropTypes.shape})),
	/** Whether a divider line should appear at the bottom of the Accordion */
	divider: PropTypes.bool,
	/** Callback for the click event on the Accordion root item */
	click: PropTypes.func,
	/** Nesting level, used for recursion */
	level: PropTypes.number
};

Accordion.defaultProps = {
	level: 0
};

const AccordionItem =({ label, level, icon, click }) => {
	return (
		<Container width="fill" padding={level > 0 ? {left: 'medium'} : {}}>
			<Container
				style={ { cursor: click ? 'pointer' :  'default'}}
				onClick={click}
				orientation="horizontal"
				width="fill"
				padding={{ horizontal: 'extralarge', vertical: 'medium' }}
				mainAlignment="flex-start"
			>
				{ icon &&
				<Padding right="small">
					<Icon icon={icon}/>
				</Padding>
				}
				<Text size="large" overflow="ellipsis">{label}</Text>
			</Container>
		</Container>
	)
};

export default Accordion;
