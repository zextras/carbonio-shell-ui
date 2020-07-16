import React, { useEffect, useState, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Popper from './Popper';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const PopoverContainer = styled.div`
	padding: ${(props) => props.theme.sizes.padding.small};
	border-radius: ${(props) => props.theme.borderRadius};
	background-color: ${(props) => props.theme.palette.gray6.regular};
	box-shadow: 0px 0px 4px 0px rgba(166,166,166,0.5);
	max-width: 92vw;
`;

const Popover = React.forwardRef(function({ children, open, anchorEl, activateOnHover, placement, onClose, ...rest }, ref) {
	const innerRef = useRef(undefined);
	const popoverRef = useCombinedRefs(ref, innerRef);
	const [innerOpen, setInnerOpen] = useState(false);
	const [virtualElement, setVirtualElement] = useState(undefined);

	const onMouseMove = useCallback(debounce(({ clientX, clientY}) => {
		if (!innerOpen) {
			setVirtualElement({
				x: clientX,
				y: clientY,
			});
			setInnerOpen(true);
			onMouseMove.cancel();
			anchorEl.current.removeEventListener('mousemove', onMouseMove);
		}
	}, 300), [innerOpen, anchorEl]);

	const closePopover = useCallback(() => {
		setInnerOpen(false);
		onMouseMove.cancel();
		anchorEl.current.removeEventListener('mousemove', onMouseMove);
	}, [onMouseMove, anchorEl]);
	const innerOnClose = useCallback(() => !activateOnHover && onClose(), [activateOnHover, onClose]);

	const onMouseEnter = useCallback(() => !innerOpen && anchorEl.current.addEventListener('mousemove', onMouseMove), [innerOpen, onMouseMove, anchorEl]);
	const onMouseLeave = useCallback((e) => {
		if (e.relatedTarget !== popoverRef.current && !popoverRef.current.contains(e.relatedTarget)) {
			closePopover();
		}
		else {
			popoverRef.current.addEventListener('mouseleave', (e) => {
				if (e.toElement !== anchorEl.current && !anchorEl.current.contains(e.toElement)) {
					closePopover();
				}
			});
		}
	}, [closePopover, popoverRef, anchorEl]);

	useEffect(() => {
		if (activateOnHover) {
			anchorEl.current.addEventListener('mouseenter', onMouseEnter);
			anchorEl.current.addEventListener('mouseleave', onMouseLeave);
			window.top.document.addEventListener('scroll', closePopover);
			return () => {
				anchorEl.current.removeEventListener('mouseenter', onMouseEnter);
				anchorEl.current.removeEventListener('mouseleave', onMouseLeave);
				window.top.document.removeEventListener('scroll', closePopover);
			};
		}
	}, [anchorEl, activateOnHover, onMouseEnter, onMouseLeave, closePopover]);

	return (
		<Popper
			ref={popoverRef}
			open={activateOnHover ? innerOpen : open}
			anchorEl={anchorEl}
			virtualElement={virtualElement}
			placement={activateOnHover ? 'top-end' : placement}
			onClose={innerOnClose}
			{...rest}
		>
			<PopoverContainer>{ children }</PopoverContainer>
		</Popper>
	);
});

Popover.propTypes = {
	/** Whether to activate the popover on hover of anchorEl. If true, the 'open' prop will be ignored.  */
	activateOnHover: PropTypes.bool
};
Popover.defaultProps = {
	activateOnHover: false
};

export default Popover;
