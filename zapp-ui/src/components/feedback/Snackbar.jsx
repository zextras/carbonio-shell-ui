import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useScreenMode } from '../../hooks/useScreenMode';
import Button from '../basic/Button';
import Icon from '../basic/Icon';
import Text from '../basic/Text';
import Container from '../layout/Container';
import Padding from '../layout/Padding';
import Row from '../layout/Row';
import Transition from '../utilities/Transition';

const SnackContainer = styled(Container)`
	position: fixed;
	box-shadow: 0px 0px 4px 0px rgba(166,166,166,0.5);
	user-select: none;
	z-index: ${(props) => props.zIndex};
	${(props) => props.screenMode === 'desktop' && css`
		right: 0;
		bottom: 5vh;
		max-width: 400px;
		min-width: calc(320px - ${(props) => `${props.theme.sizes.padding.small} - ${props.theme.sizes.padding.small}`});
	`};
	${(props) => props.screenMode === 'mobile' && css`
		right: 50%;
		transform: translateX(50%);
		bottom: ${props.theme.sizes.padding.small};
		min-width: calc(320px - ${(props) => `${props.theme.sizes.padding.small} - ${props.theme.sizes.padding.small}`});
		max-width: calc(100% - ${(props) => `${props.theme.sizes.padding.small} - ${props.theme.sizes.padding.small}`});  
  `};
`;
const icons = {
	success: 'Checkmark',
	info: 'InfoOutline',
	warning: 'AlertTriangleOutline',
	error: 'Close'
};
const Snackbar = React.forwardRef(function({
	open,
	type,
	label,
	disableAutoHide,
	hideButton,
	actionLabel,
	onActionClick,
	onClose,
	zIndex,
	autoHideTimeout,
	target
}, ref) {
	const screenMode = useScreenMode(target);

	const handleClick = useCallback(() => {
		onActionClick ? onActionClick() : (onClose && onClose());
	}, [onActionClick, onClose]);

	useEffect(() => {
		if (open && !disableAutoHide) {
			const timeout = setTimeout(onClose, autoHideTimeout);
			return () => clearTimeout(timeout);
		}
	}, [open, disableAutoHide]);

	if (!open) return null;
	return (
		<Transition ref={ref} type="fade-in-right">
			<SnackContainer
				screenMode={screenMode}
				orientation="horizontal"
				mainAlignment="space-between"
				background={type}
				height="auto"
				width="auto"
				zIndex={zIndex}
			>
				<Row
					mainAlignment="flex-start"
					takeAvailableSpace={true}
					padding={{
						top: 'small',
						bottom: 'small',
						left: 'small'
					}}
				>
					<Icon size="large" icon={icons[type]} color="gray6" />
					<Padding left="medium" right="medium" style={{
						flexBasis: 0,
						flexGrow: 1,
						minWidth: '1px'
					}}>
						<Text color="gray6" size="large">{ label }</Text>
					</Padding>
				</Row>
				{ !hideButton && <Padding right="extrasmall"><Button label={actionLabel} type="ghost" labelColor="gray6" onClick={handleClick} /></Padding> }
			</SnackContainer>
		</Transition>
	);
});

Snackbar.propTypes = {
	/** Whether to show the Snackbar or not */
	open: PropTypes.bool,
	/** Snackbar Type */
	type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
	/** Snackbar text message */
	label: PropTypes.string.isRequired,
	/** Snackbar button text */
	actionLabel: PropTypes.string,
	/** Button's click callback */
	onActionClick: PropTypes.func,
	/** Callback to handle Snackbar closing */
	onClose: PropTypes.func,
	/** Disable the autoHide funtionality */
	disableAutoHide: PropTypes.bool,
	/** Hide the button in the Snackbar */
	hideButton: PropTypes.bool,
	/** zIndex of the snackbar */
	zIndex: PropTypes.number,
	/** autoHide timing in milliseconds */
	autoHideTimeout: PropTypes.number,
	/** Window object to use as reference to determine the screenMode */
	target: PropTypes.instanceOf(Window)
};

Snackbar.defaultProps = {
	open: false,
	type: 'info',
	actionLabel: 'Ok',
	disableAutoHide: false,
	hideButton: false,
	zIndex: 101,
	autoHideTimeout: 4000,
	target: window.top
};

export default Snackbar;
