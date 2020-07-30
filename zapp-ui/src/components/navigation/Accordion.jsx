import React, {useCallback, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Container from '../layout/Container';
import Text from '../basic/Text';
import Divider from '../layout/Divider';
import Icon from '../basic/Icon';
import IconButton from '../inputs/IconButton';
import Padding from '../layout/Padding';
import Badge from '../basic/Badge';
import Collapse from '../utilities/Collapse';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';
import {pseudoClasses} from '../utilities/functions';

const AccordionContainerEl = styled(Container)`
	padding: ${(props) => `
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		${props.theme.sizes.padding.large}
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		calc(${props.theme.sizes.padding.large} + ${props.level > 1 ? props.theme.sizes.padding.medium : '0px'})
	`};
	${({theme}) => pseudoClasses(theme, 'gray5')};
`;

const Accordion = React.forwardRef(function({ active, label, items, icon, divider, level, click, badgeType, badgeCounter }, ref) {
	const [open, setOpen] = useState(false);
	const innerRef = useRef(undefined);
	const accordionRef = useCombinedRefs(ref, innerRef);

	const handleClick = useCallback((e) => {
		setOpen(true);
		if (click) click(e);
	}, [setOpen, click]);
	const expandOnIconClick = useCallback((e) => {
		e.stopPropagation();
		setOpen((open) => !open);
	}, [setOpen]);

	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(accordionRef, keyEvents);

	return (
		<Container
			orientation="vertical"
			width="fill"
			height="fit"
			background="gray5"
		>
			<AccordionContainerEl
				ref={accordionRef}
				level={level}
				style={{ cursor: click ? 'pointer' :  'default' }}
				onClick={handleClick}
				orientation="horizontal"
				width="fill"
				height="fit"
				mainAlignment="space-between"
				tabIndex={0}
			>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					padding={{ right: 'small' }}
					style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
				>
					{ icon &&
					<Padding right="small">
						<Icon icon={icon} size="large" />
					</Padding>
					}
					<Text
						size="large"
						weight={active ? 'bold' : 'regular'}
						style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
					>{label}</Text>
					{ typeof badgeCounter !== 'undefined' && (
						<Padding left="small">
							<Badge type={badgeType} value={badgeCounter} />
						</Padding>
					)}
				</Container>
				{ items
				&& items.length > 0
				&& <IconButton
							customSize={{ iconSize: 'large', paddingSize: 0 }}
							onClick={expandOnIconClick}
							icon={ open ? 'ArrowIosUpward' : 'ArrowIosDownward'}
							style={{ cursor: 'pointer' }}
						/>
				}
			</AccordionContainerEl>
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
						? <Accordion
								key={item.id}
								level={level + 1}
								active={item.active}
								click={item.click}
								label={item.label}
								icon={item.icon}
								items={item.items}
								badgeType={item.badgeType}
								badgeCounter={item.badgeCounter} />
						: <AccordionItem
								key={item.id}
								level={level + 1}
								active={item.active}
								click={item.click}
								label={item.label}
								icon={item.icon}
								badgeType={item.badgeType}
								badgeCounter={item.badgeCounter} />
					)}
				</Container>
			</Collapse>
			{ divider && <Divider color="gray2"/>}
		</Container>
	);
});

Accordion.propTypes = {
	/** The label of the accordion */
	label: PropTypes.string.isRequired,
	/** Optional, the name of the icon to display next to the label */
	icon: PropTypes.string,
	/** Items tree object, can be nested */
	items: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.string, label: PropTypes.string, click: PropTypes.func, icon: PropTypes.string, items: PropTypes.shape})),
	/** Whether a divider line should appear at the bottom of the Accordion */
	divider: PropTypes.bool,
	/** Callback for the click event on the Accordion root item */
	click: PropTypes.func,
	/** Nesting level, used for recursion */
	level: PropTypes.number,
	/** If it's active */
	active: PropTypes.bool,
	/** Badge Type */
	badgeType: Badge.propTypes.type,
	/** Badge counter */
	badgeCounter: PropTypes.number
};

Accordion.defaultProps = {
	level: 0,
	active: false,
	badgeType: 'read'
};

const ItemContainerEl = styled(Container)`
	padding: ${(props) => `
		${props.theme.sizes.padding.medium}
		calc(${props.theme.sizes.padding.large} + ${props.theme.sizes.icon.large} + ${props.theme.sizes.padding.small})
		${props.theme.sizes.padding.medium} calc(${props.theme.sizes.padding.large} + ${props.level > 1 ? props.theme.sizes.padding.medium : '0px'})`};
	${({theme}) => pseudoClasses(theme, 'gray5')};

`;

const AccordionItem = ({ active = false, label, level, icon, click, badgeType = 'read', badgeCounter }) => {
	const accordionItemRef = useRef(undefined);

	const keyEvents = useMemo(() => click ? getKeyboardPreset('button', click) : [], [click]);
	useKeyboard(accordionItemRef, keyEvents);

	return (
		<Container width="fill">
			<ItemContainerEl
				level={level}
				ref={accordionItemRef}
				style={{ cursor: click ? 'pointer' :  'default'}}
				onClick={click}
				orientation="horizontal"
				width="fill"
				mainAlignment="flex-start"
				tabIndex={0}
			>
				{ icon &&
				<Padding right="small">
					<Icon icon={icon} size="large" />
				</Padding>
				}
				<Text
					size="large"
					weight={active ? 'bold' : 'regular'}
					style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
				>{label}</Text>
				{ typeof badgeCounter !== 'undefined' && (
					<Padding left="small">
						<Badge type={badgeType} value={badgeCounter} />
					</Padding>
				)}
			</ItemContainerEl>
		</Container>
	)
};

export default Accordion;
