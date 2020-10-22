import React, {useCallback, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import {
	Container, Text, Divider, Icon, IconButton, Padding, Collapse
} from '@zextras/zapp-ui';
import useKeyboard, { getKeyboardPreset } from '../../zapp-ui/src/hooks/useKeyboard';
import { useCombinedRefs } from '../../zapp-ui/src/hooks/useCombinedRefs';
import { pseudoClasses } from '../../zapp-ui/src/components/utilities/functions';

const AccordionContainerEl = styled(Container)`
	padding: ${(props) => `
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		${props.theme.sizes.padding.large}
		${props.level === 0 ? props.theme.sizes.padding.large : props.theme.sizes.padding.medium}
		calc(${props.theme.sizes.padding.large} + ${props.level > 1 ? props.theme.sizes.padding.medium : '0px'})
	`};
	${({theme}) => pseudoClasses(theme, 'gray5')};
`;

const NavigationBarAccordion = React.forwardRef(function({
	active,
	icon,
	divider,
	click,
	customComponent,
	label,
	...rest
}, ref) {
	const level = 0;
	const [open, setOpen] = useState(false);
	const innerRef = useRef(undefined);
	const accordionRef = useCombinedRefs(ref, innerRef);

	const handleClick = useCallback((e) => {
		setOpen(true);
		if (click) click(e);
	}, [setOpen, click]);
	const expandOnIconClick = useCallback((e) => {
		e.stopPropagation();
		setOpen((isOpen) => !isOpen);
	}, [setOpen]);

	const keyEvents = useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	useKeyboard(accordionRef, keyEvents);

	return (
		<Container
			orientation="vertical"
			width="fill"
			height="fit"
			background="gray5"
			{...rest}
		>
			<AccordionContainerEl
				ref={accordionRef}
				level={level}
				style={{ cursor: click ? 'pointer' : 'default' }}
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
					<Padding right="small">
						<Icon icon={icon} size="large" />
					</Padding>
					<Text
						size="large"
						weight={active ? 'bold' : 'regular'}
						style={{ minWidth: 0, flexBasis: 0, flexGrow: 1 }}
					>
						{label}
					</Text>
				</Container>
				<IconButton
					customSize={{ iconSize: 'large', paddingSize: 0 }}
					onClick={expandOnIconClick}
					icon={open ? 'ArrowIosUpward' : 'ArrowIosDownward'}
					style={{ cursor: 'pointer' }}
				/>
			</AccordionContainerEl>
			<Collapse
				crossSize="100%"
				orientation="vertical"
				open={open}
			>
				<Container
					orientation="vertical"
					height="fit"
					width="fill"
					crossAlignment="flex-start"
				>
					{ customComponent }
				</Container>
			</Collapse>
			{ divider && <Divider color="gray2" />}
		</Container>
	);
});

export default NavigationBarAccordion;