import React, {useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo} from 'react';
import { createPopper } from '@popperjs/core';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import Padding from '../layout/Padding';
import Icon from '../basic/Icon';
import Text from '../basic/Text';
import Container from '../layout/Container';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { pseudoClasses } from '../utilities/functions';

const PopperDropdownWrapper = styled.div`
	position: relative;
	display: ${(props) => props.display};
	width: ${(props) => props.display === 'block' ? '100%' : 'auto'};
`;
const PopperList = styled.div`
	position: absolute;
	display: none;
	visibility: hidden;
	pointer-events: none;
	background-color: ${({theme}) => theme.palette.gray5.regular};
	box-shadow: 0px 0px 4px 0px rgba(166,166,166,0.5);
	z-index: 99;
	
	padding: ${(props) => props.theme.sizes.padding.small} 0;
	max-width: ${(props) => props.width === '100%' ? '100%' : props.maxWidth};
	max-height: 50vh;
	width: ${(props) => props.width};
	overflow-y: auto;

	&, > [tabindex="-1"]:focus {
		outline: none;
	}
 
	${(props) => props.open && css`
		display: block;
		visibility: visible;
		pointer-events: auto;
	`};
`;

const Dropdown = React.forwardRef(function({
	disabled,
	items,
	placement,
	display,
	width,
	maxWidth,
	handleTriggerEvents,
	disableRestoreFocus,
	multiple,
	onOpen,
	onClose,
	children,
	...rest
}, ref) {
	const [open, setOpen] = useState(false);
	const openRef = useRef(open);
	const dropdownRef = useRef(undefined);
	const triggerRef = useRef(undefined);
	const popperItemsRef = useRef(undefined);
	const startSentinelRef = useRef(undefined);
	const endSentinelRef = useRef(undefined);

	const openPopper = useCallback(() => {
		setOpen(true);
		onOpen && onOpen();

		setTimeout(() => {
			const selectedItems = dropdownRef.current.querySelectorAll('.selected');
			selectedItems.length > 0 ? selectedItems[0].focus() : popperItemsRef.current.children[0].focus();
		}, 1);
	}, [onOpen]);

	const closePopper = useCallback(() => {
		setOpen(false);
		!disableRestoreFocus && triggerRef.current.focus();
		onClose && onClose();
	}, [disableRestoreFocus, onClose]);

	const handleClick = useCallback((e) => {
		if (!disabled && !openRef.current) {
			e.preventDefault();
			openPopper();
		}
	}, [disabled, openPopper, closePopper]);

	const clickOutsidePopper = useCallback((e) => {
		e.target !== dropdownRef.current && !dropdownRef.current.contains(e.target) && closePopper();
	}, [closePopper]);

	const onStartSentinelFocus = useCallback(() => popperItemsRef.current.querySelector('div[tabindex]:last-child').focus(), []);
	const onEndSentinelFocus = useCallback(() => popperItemsRef.current.querySelector('div[tabindex]:first-child').focus(), []);

	const triggerEvents = handleTriggerEvents && useMemo(() => getKeyboardPreset('button', handleClick), [handleClick]);
	handleTriggerEvents && useKeyboard(triggerRef, triggerEvents);
	const listEvents = useMemo(() => getKeyboardPreset('list', () => {}, popperItemsRef), [popperItemsRef]);
	useKeyboard(popperItemsRef, listEvents);
	const escapeEvent = useMemo(() => [{ type: 'keydown', callback: closePopper, keys: ['Escape'] }], [closePopper]);
	useKeyboard(dropdownRef, escapeEvent);

	useLayoutEffect(() => {
		if (open) {
			const popperOptions = {
				placement: placement
			};
			const popperInstance = createPopper(triggerRef.current, dropdownRef.current, popperOptions);

			return () => popperInstance.destroy();
		}
	}, [open, placement]);

	useEffect(() => {
		openRef.current = open;
		open && setTimeout(() => window.addEventListener('click', clickOutsidePopper), 1);

		return () => window.removeEventListener('click', clickOutsidePopper);
	}, [open, closePopper]);

	useEffect(() => {
		if (open) {
			popperItemsRef.current.focus();
			startSentinelRef.current.addEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current.addEventListener('focus', onEndSentinelFocus);
		}

		return () => {
			startSentinelRef.current && startSentinelRef.current.removeEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current && endSentinelRef.current.removeEventListener('focus', onEndSentinelFocus);
		};
	}, [open, startSentinelRef, endSentinelRef]);

	const popperListItems = useMemo(() => {
		return items.map((item) =>
			<PopperListItem
				icon={item.icon}
				label={item.label}
				click={(e) => {
					item.click(e);
					!multiple && closePopper();
				}}
				selected={item.selected}
				key={item.id}
			/>
		)
	}, [items, multiple, closePopper]);

	return (
		<PopperDropdownWrapper ref={ref} display={display} {...rest}>
			{ React.cloneElement( children, {ref: triggerRef, onClick: handleClick} )}
			<PopperList ref={dropdownRef} width={width} maxWidth={maxWidth} open={open}>
				<div tabIndex={0} ref={startSentinelRef}></div>
				<div ref={popperItemsRef} tabIndex={-1}>{ popperListItems }</div>
				<div tabIndex={0} ref={endSentinelRef}></div>
			</PopperList>
		</PopperDropdownWrapper>
	);
});

Dropdown.propTypes = {
	/** whether to disable the Dropdown or not */
	disabled: PropTypes.bool,
	/** Map of items to display */
	items: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			icon: PropTypes.string,
			click: PropTypes.func,
			selected: PropTypes.bool
		})
	).isRequired,
	/** Css display property */
	display: PropTypes.oneOf(['block', 'inline-block']),
	/** Dropdown width type */
	width: PropTypes.oneOf(['auto', '100%']),
	/** Css max-width property */
	maxWidth: PropTypes.string,
	/** whether or not to manage the keyboard events for dropdown trigger */
	handleTriggerEvents: PropTypes.bool,
	/** whether or not to disable the re-focus of Dropdown's trigger */
	disableRestoreFocus: PropTypes.bool,
	/** whether or not to user can select multiple items of dropdown */
	multiple: PropTypes.bool,
	/** Callback for opened Dropdown */
	onOpen: PropTypes.func,
	/** Callback for closed Dropdown */
	onClose: PropTypes.func,
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

Dropdown.defaultProps = {
	disabled: false,
	placement: 'bottom-start',
	display: 'inline-block',
	width: 'auto',
	maxWidth: '300px',
	handleTriggerEvents: false,
	disableRestoreFocus: false,
	multiple: false
};

const ContainerEl = styled(Container)`
	user-select: none;
	${({theme}) => pseudoClasses(theme, 'gray5')};
`;

function PopperListItem({ icon, label, click, selected }) {
	const itemRef = useRef(undefined);

	const keyEvents = useMemo(() => getKeyboardPreset('listItem', click), [click]);
	useKeyboard(itemRef, keyEvents);

	return (
		<ContainerEl
			ref={itemRef}
			className={selected ? 'selected' : ''}
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
					<Icon icon={icon} size="medium" color="text" style={{ pointerEvents: 'none' }} />
				</Padding>
			}
			<Text size="medium" weight="regular" color="text">
				{label}
			</Text>
		</ContainerEl>
	);
}

export default Dropdown;
