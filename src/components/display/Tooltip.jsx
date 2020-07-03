import React, { useState, useEffect, useLayoutEffect, useCallback, useRef, cloneElement, Fragment } from 'react';
import { createPopper } from '@popperjs/core';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Text from '../basic/Text';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const TooltipWrapper = React.forwardRef(function({ open, children, ...rest }, ref) {
	if (!open) return null;

	return (
		<Text size="medium" ref={ref} {...rest}>{children}</Text>
	);
});
const TooltipWrapperWithCss = styled(TooltipWrapper)`
	display: none;
	position: fixed;
	top: -1000px;
	left: -1000px;
	z-index: 98;

	max-width: ${(props) => props.maxWidth};
	padding: ${(props) => props.theme.sizes.padding.small};
	background: ${(props) => props.theme.palette.gray3.regular};
	border-radius: ${(props) => props.theme.borderRadius};
	user-select: none;

	${(props) => props.open && css`
		display: block;
	`};
`;

const Tooltip = React.forwardRef(function({ label, placement, maxWidth, children }, ref) {
	const [open, setOpen] = useState(undefined);
	const popperInstanceRef = useRef(undefined);
	const triggerRef = useRef(undefined);
	const innerRef = useRef(undefined);
	const tooltipRef = useCombinedRefs(ref, innerRef);

	const showTooltip = useCallback(() => setOpen(true), []);
	const hideTooltip = useCallback(() => setOpen(false), []);

	useLayoutEffect(() => {
		if (typeof open === "undefined") return;

		if (open) {
			popperInstanceRef.current = createPopper(triggerRef.current, tooltipRef.current, {
				placement: placement,
				modifiers: [
					{
						name: 'offset',
						options: {
							offset: [0, 8],
						},
					},
					{
						name: 'flip',
						options: {
							fallbackPlacements: ['bottom', 'top', 'left'],
						},
					},
				]
			});
		} else if (typeof popperInstanceRef.current !== 'undefined') {
			popperInstanceRef.current.destroy();
		}
	}, [open]);

	useEffect(() => {
		// Added timeout to fix Preact weird bug
		setTimeout(() => {
			if (triggerRef && triggerRef.current) {
				triggerRef.current.addEventListener('focus', showTooltip);
				triggerRef.current.addEventListener('blur', hideTooltip);
				triggerRef.current.addEventListener('mouseenter', showTooltip);
				triggerRef.current.addEventListener('mouseleave', hideTooltip);
			}
		}, 1);
		return (() => {
			if (triggerRef && triggerRef.current) {
				triggerRef.current.removeEventListener('focus', showTooltip);
				triggerRef.current.removeEventListener('blur', hideTooltip);
				triggerRef.current.removeEventListener('mouseenter', showTooltip);
				triggerRef.current.removeEventListener('mouseleave', hideTooltip);
			}
		});
	}, [triggerRef, showTooltip, hideTooltip]);

	return (
		<Fragment>
			{ cloneElement(children, { ref: triggerRef }) }
			<TooltipWrapperWithCss open={open} ref={tooltipRef} maxWidth={maxWidth}>{ label }</TooltipWrapperWithCss>
		</Fragment>
	);
});

Tooltip.propTypes = {
	/** Tooltip text */
	label: PropTypes.string,
	/** Tooltip placement */
	placement: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
	/** Tooltip max-width css property */
	maxWidth: PropTypes.string,
};

Tooltip.defaultProps = {
	placement: 'bottom',
	maxWidth: '284px'
};

export default Tooltip;
