import React, {
	useEffect,
	useMemo,
	useCallback,
	useRef
} from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Button from '../basic/Button';
import Container from '../layout/Container';
import Divider from '../layout/Divider';
import IconButton from '../inputs/IconButton';
import Row from '../layout/Row';
import Text from '../basic/Text';
import Transition from '../utilities/Transition';
import useKeyboard from '../../hooks/useKeyboard';
import { useScreenMode } from '../../hooks/useScreenMode';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const modalMinWidth = { extrasmall: '20%', small: '25%', medium: '35%', large: '50%' };
const modalWidth = { extrasmall: '400px', small: '500px', medium: '650px', large: '800px' };

function isBodyOverflowing(modalRef) {
	return window.top.document.body.scrollHeight > modalRef.current.clientHeight || window.top.document.body.scrollWidth > window.top.document.body.clientWidth;
}
function getScrollbarSize() {
	const scrollDiv = window.top.document.createElement('div');
	scrollDiv.style.width = '99px';
	scrollDiv.style.height = '99px';
	scrollDiv.style.position = 'absolute';
	scrollDiv.style.top = '-9999px';
	scrollDiv.style.overflow = 'scroll';

	window.top.document.body.appendChild(scrollDiv);
	const scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
	window.top.document.body.removeChild(scrollDiv);

	return scrollbarSize;
}
function copyToClipboard(node) {
	const el = window.top.document.createElement('textarea');
	el.value = node.textContent;
	window.top.document.body.appendChild(el);
	el.select();
	window.top.document.execCommand('copy');
	window.top.document.body.removeChild(el);
}

const ModalContainer = styled.div`
	display: flex;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	padding: ${(props) => `${props.theme.sizes.padding.medium} ${props.theme.sizes.padding.medium} 0`};
	overflow-y: auto;
	background-color: rgba(0,0,0,0);
	opacity: 0;
	pointer-events: none;
	transition: 0.3s ease-out;
	z-index: -1;

	${(props) => props.open && css`
		background-color: rgba(0,0,0,0.5);
		opacity: 1;
		pointer-events: auto;
		z-index: ${(props) => props.zIndex};
	`};
	${(props) => props.screenMode === 'mobile' && css`
		justify-content: center;
		align-items: center;
	`};
	${(props) => props.screenMode === 'desktop' && css`
		align-items: flex-start;
	`};
`;
const ModalWrapper = styled.div`
	max-width: 100%;
	width: 100%;
	margin: 0 auto;
	${(props) => props.screenMode === 'mobile' && css`
		margin: auto;
	`};
	box-sizing: border-box;
	pointer-events: none;
`;
const ModalContent = styled(Container)`
	position: relative;
	transform: translateY(20vh);
	${(props) => props.screenMode === 'mobile' && css`
		transform: translateY(0);
	`};

	margin: 0 auto ${(props) => props.theme.sizes.padding.medium};
	padding: ${(props) => `${props.theme.sizes.padding.extralarge} ${props.theme.sizes.padding.extralarge} 0`};
	max-width: 100%;
	min-width: ${(props) => modalMinWidth[props.size] };
	width: ${(props) => modalWidth[props.size] };

	background-color: ${(props) => props.theme.palette.gray6.regular};
	border-radius: 16px;
	box-shadow: 0px 0px 4px 0px rgba(166,166,166,0.5);
	outline: none;
	pointer-events: auto;
`;
const ModalTitle = styled(Text)`
	box-sizing: border-box;
	width: 100%;
	flex-grow: 1;
	flex-basis: 0;
	padding: ${(props) => props.theme.sizes.padding.small };
	${(props) => props.centered && css`
		text-align: center;
	`};
`;
const ModalBody = styled.div`
	box-sizing: border-box;
	width: 100%;
	padding: ${(props) => props.theme.sizes.padding.small };
	${(props) => props.centered && css`
		text-align: center;
	`};
`;
const ModalFooterWrapper = styled(Container)`
	padding: ${(props) => `${props.theme.sizes.padding.large} 0` };
`;
const OptionalFooterContainer = styled(Container)`
	min-width: 1px;
	flex-basis: auto;
	flex-grow: 1;
`;
const ButtonContainer = styled(Container)`
	min-width: 1px;
	flex-basis: auto;
	flex-grow: 1;
`;
const DismissButton = styled(Button)`
	margin-right: ${(props) => props.theme.sizes.padding.large};
	flex-basis: auto;
	min-width: 100px;
	flex-shrink: 1;
`;
const ConfirmButton = styled(Button)`
	flex-basis: auto;
	min-width: 100px;
	flex-shrink: 1;
`;
const ModalCloseIcon = styled(IconButton)`
	padding: ${({ theme }) => theme.sizes.padding.extrasmall};
`;

const Modal = React.forwardRef(function({
	type,
	title,
	size,
	open,
	centered,
	onConfirm,
	confirmLabel,
	confirmColor,
	onSecondaryAction,
	secondaryActionLabel,
	onClose,
	dismissLabel,
	copyLabel,
	optionalFooter,
	customFooter,
	showCloseIcon,
	children,
	...rest
}, ref) {

	const innerRef = useRef(undefined);
	const modalRef = useCombinedRefs(ref, innerRef);
	const modalWrapperRef = useRef(undefined);
	const modalBodyRef = useRef(undefined);
	const startSentinelRef = useRef(undefined);
	const endSentinelRef = useRef(undefined);

	const screenMode = useScreenMode();

	const onBackdropClick = useCallback((e) => !modalWrapperRef.current.contains(e.target) && onClose(e), [onClose]);
	const onCopyClipboard = useCallback(() => copyToClipboard(modalBodyRef.current), []);

	const onStartSentinelFocus = useCallback(() => {
		const nodeList = modalWrapperRef.current.querySelectorAll('[tabindex]');
		nodeList[nodeList.length - 1].focus();
	}, []);
	const onEndSentinelFocus = useCallback(() => modalWrapperRef.current.querySelector('[tabindex]').focus(), []);

	const escapeEvent = useMemo(() => [{ type: 'keydown', callback: onClose, keys: ['Escape'] }], [onClose]);
	useKeyboard(modalRef, escapeEvent);

	useEffect(() => {
		if (open) {
			const defaultOverflowY = window.top.document.body.style.overflowY;
			const defaultPaddingRight = window.top.document.body.style.paddingRight;

			window.top.document.body.style.overflowY = 'hidden';
			isBodyOverflowing(modalRef) && (window.top.document.body.style.paddingRight = getScrollbarSize()+'px');

			return () => {
				window.top.document.body.style.overflowY = defaultOverflowY;
				window.top.document.body.style.paddingRight = defaultPaddingRight;
			};
		}
	}, [open]);

	useEffect(() => {
		const focusedElement = window.top.document.activeElement;

		if (open) {
			modalWrapperRef.current.focus();
			startSentinelRef.current.addEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current.addEventListener('focus', onEndSentinelFocus);
		}

		return () => {
			startSentinelRef.current && startSentinelRef.current.removeEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current && endSentinelRef.current.removeEventListener('focus', onEndSentinelFocus);
			open && focusedElement.focus();
		};
	}, [open, onStartSentinelFocus, onEndSentinelFocus]);

	return (
		<ModalContainer ref={modalRef} open={open} screenMode={screenMode} onClick={onBackdropClick} { ...rest }>
			<div tabIndex={0} ref={startSentinelRef}></div>
			<Transition type="scale-in" apply={open}>
				<ModalWrapper screenMode={screenMode}>
					<ModalContent tabIndex={-1} ref={modalWrapperRef} screenMode={screenMode} size={size} crossAlignment="flex-start" height="auto">
						<Row width="100%">
							<ModalTitle centered={centered} color={type === 'error' ? 'error' : undefined} size="large" weight="bold">{ title }</ModalTitle>
							{ onSecondaryAction && secondaryActionLabel && <ModalCloseIcon icon="Close" size="medium" onClick={onClose} /> }
						</Row>
						<Divider />
						<ModalBody centered={centered} ref={modalBodyRef}>{ children }</ModalBody>
						<Divider />
						<ModalFooterWrapper orientation={centered ? 'vertical' : 'horizontal'} mainAlignment="flex-end" padding={{ top: "large" }}>
							{ customFooter ? customFooter :
								<ModalFooter
									type={type}
									centered={centered}
									optionalFooter={optionalFooter}
									confirmLabel={confirmLabel}
									confirmColor={confirmColor}
									dismissLabel={dismissLabel}
									onConfirm={onConfirm}
									onClose={onClose}
									onSecondaryAction={onSecondaryAction}
									secondaryActionLabel={secondaryActionLabel}
									onCopyClipboard={onCopyClipboard}
									copyLabel={copyLabel}
								/>
							}
						</ModalFooterWrapper>
					</ModalContent>
				</ModalWrapper>
			</Transition>
			<div tabIndex={0} ref={endSentinelRef}></div>
		</ModalContainer>
	);
});

Modal.propTypes = {
	/** Modal type */
	type: PropTypes.oneOf(['default', 'error']),
	/** Modal title */
	title: PropTypes.string,
	/** Modal size */
	size: PropTypes.oneOf(['extrasmall', 'small', 'medium', 'large']),
	/** Boolean to show the modal */
	open: PropTypes.bool,
	/** Centered Modal */
	centered: PropTypes.bool,
	/** Callback for main action */
	onConfirm: PropTypes.func,
	/** Label for the Main action Button */
	confirmLabel: PropTypes.string,
	/** BackgroundColor for the Main action Button */
	confirmColor: Button.propTypes.color,
	/** Callback for secondary action */
	onSecondaryAction: PropTypes.func,
	/** Label for the Secondary action Button */
	secondaryActionLabel: PropTypes.string,
	/** Callback to close the Modal */
	onClose: PropTypes.func,
	/** Label for the Modal close Button */
	dismissLabel: PropTypes.string,
	/** Label for copy button in the Error Modal */
	copyLabel: PropTypes.string,
	/** Optional element to show in the footer of the Modal */
	optionalFooter: PropTypes.element,
	/** Prop to override the default footer buttons */
	customFooter: PropTypes.element,
	/** Show icon to close Modal */
	showCloseIcon: PropTypes.bool,
	/** Css property to handle the stack order of multiple modals */
	zIndex: PropTypes.number
};

Modal.defaultProps = {
	type: 'default',
	size: 'small',
	centered: false,
	confirmLabel: 'OK',
	confirmColor: 'primary',
	copyLabel: 'Copy',
	showCloseIcon: false,
	zIndex: 100
};

function ModalFooter({
	type,
	centered,
	onConfirm,
	confirmLabel,
	confirmColor,
	onSecondaryAction,
	secondaryActionLabel,
	onClose,
	dismissLabel,
	copyLabel,
	optionalFooter,
	onCopyClipboard
}) {

	const secondaryButton = useMemo(() => {
		let button;
		if (type === 'error') {
			button = <DismissButton onClick={onCopyClipboard} color="secondary" label={copyLabel} />;
		}
		else {
			button = onSecondaryAction && secondaryActionLabel ?
				<DismissButton color="primary" type="outlined" onClick={onSecondaryAction} label={secondaryActionLabel} /> : dismissLabel ?
					<DismissButton color="secondary" onClick={onClose} label={dismissLabel} /> : undefined;
		}
		return button;
	}, [type, onSecondaryAction, secondaryActionLabel, onClose, dismissLabel]);

	return (
		<>
			{ optionalFooter && <OptionalFooterContainer padding={centered ? { bottom: 'large' } : { right: 'large' }} orientation="horizontal" mainAlignment="flex-start">
				{ optionalFooter }
			</OptionalFooterContainer> }
			<ButtonContainer orientation="horizontal" mainAlignment={centered ? 'center' : 'flex-end'}>
				{ secondaryButton }
				<ConfirmButton color={confirmColor} onClick={onConfirm || onClose} label={confirmLabel} />
			</ButtonContainer>
		</>
	);
}

export default Modal;
