import React, {
	useState,
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
import Portal from '../utilities/Portal';
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
	background-color: rgba(0,0,0,0);
	opacity: 0;
	pointer-events: none;
	transition: 0.3s ease-out;
	z-index: -1;
	justify-content: center;
	align-items: center;

	${(props) => (props.mounted || props.open) && css`
		z-index: ${(props) => props.zIndex};
	`};
	${(props) => props.open && css`
		background-color: rgba(0,0,0,0.5);
		opacity: 1;
		pointer-events: auto;
	`};
`;
const ModalWrapper = styled.div`
	max-width: 100%;
	width: 100%;
	margin: auto;
	box-sizing: border-box;
	pointer-events: none;
`;
const ModalContent = styled(Container)`
	position: relative;
	margin: 0 auto ${(props) => props.theme.sizes.padding.medium};
	padding: ${(props) => `${props.theme.sizes.padding.extralarge} ${props.theme.sizes.padding.extralarge} 0`};
	max-width: 100%;
	min-width: ${(props) => modalMinWidth[props.size]};
	width: ${(props) => modalWidth[props.size]};

	background-color: ${(props) => props.theme.palette[props.background].regular};
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
	padding: ${(props) => props.theme.sizes.padding.small};
	${(props) => props.centered && css`
		text-align: center;
	`};
`;
const ModalBody = styled.div`
	overflow-y: auto;
	max-height: ${(props) => props.maxHeight};
	max-width: 100%;
	box-sizing: border-box;
	width: 100%;
	padding: ${(props) => props.theme.sizes.padding.small};
	${(props) => props.centered && css`
		text-align: center;
	`};
`;
const ModalFooterWrapper = styled(Container)`
	padding: ${(props) => `${props.theme.sizes.padding.large} 0`};
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

const Modal = React.forwardRef(function Modal({
	background,
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
	hideFooter,
	showCloseIcon,
	maxHeight,
	children,
	disablePortal,
	...rest
}, ref) {
	const [delayedOpen, setDelayedOpen] = useState(false);

	const innerRef = useRef(undefined);
	const modalRef = useCombinedRefs(ref, innerRef);
	const modalContentRef = useRef(undefined);
	const modalBodyRef = useRef(undefined);
	const startSentinelRef = useRef(undefined);
	const endSentinelRef = useRef(undefined);

	const screenMode = useScreenMode();

	const onBackdropClick = useCallback((e) => modalContentRef.current && !modalContentRef.current.contains(e.target) && onClose(e), [onClose]);
	const onCopyClipboard = useCallback(() => copyToClipboard(modalBodyRef.current), []);

	const onStartSentinelFocus = useCallback(() => {
		const nodeList = modalContentRef.current.querySelectorAll('[tabindex]');
		nodeList[nodeList.length - 1].focus();
	}, []);
	const onEndSentinelFocus = useCallback(() => modalContentRef.current.querySelector('[tabindex]').focus(), []);

	const escapeEvent = useMemo(() => [{ type: 'keydown', callback: onClose, keys: ['Escape'] }], [onClose]);
	useKeyboard(modalRef, escapeEvent);

	useEffect(() => {
		if (open) {
			const defaultOverflowY = window.top.document.body.style.overflowY;
			const defaultPaddingRight = window.top.document.body.style.paddingRight;

			window.top.document.body.style.overflowY = 'hidden';
			isBodyOverflowing(modalRef) && (window.top.document.body.style.paddingRight = `${getScrollbarSize()}px`);

			return () => {
				window.top.document.body.style.overflowY = defaultOverflowY;
				window.top.document.body.style.paddingRight = defaultPaddingRight;
			};
		}
	}, [open]);

	useEffect(() => {
		const focusedElement = window.top.document.activeElement;

		if (open) {
			modalContentRef.current.focus();
			startSentinelRef.current.addEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current.addEventListener('focus', onEndSentinelFocus);
		}

		return () => {
			startSentinelRef.current && startSentinelRef.current.removeEventListener('focus', onStartSentinelFocus);
			endSentinelRef.current && endSentinelRef.current.removeEventListener('focus', onEndSentinelFocus);
			open && focusedElement.focus();
		};
	}, [open, onStartSentinelFocus, onEndSentinelFocus]);

	useEffect(() => {
		setTimeout(() => setDelayedOpen(open), 1);
	}, [open]);

	return (
		<Portal show={open} disablePortal={disablePortal}>
			<ModalContainer
				ref={modalRef}
				open={delayedOpen}
				mounted={open}
				screenMode={screenMode}
				onClick={onBackdropClick}
				{...rest}
			>
				<div tabIndex={0} ref={startSentinelRef}></div>
				<Transition type="scale-in" apply={delayedOpen}>
					<ModalWrapper>
						<ModalContent
							ref={modalContentRef}
							background={background}
							tabIndex={-1}
							screenMode={screenMode}
							size={size}
							crossAlignment="flex-start"
							height="auto"
						>
							<Row width="100%">
								<ModalTitle
									centered={centered}
									color={type === 'error' ? 'error' : undefined}
									size="large"
									weight="bold"
								>
									{title}
								</ModalTitle>
								{showCloseIcon && <ModalCloseIcon icon="Close" size="medium" onClick={onClose} />}
							</Row>
							<Divider />
							<ModalBody centered={centered} ref={modalBodyRef} maxHeight={maxHeight}>{children}</ModalBody>
							{!hideFooter && (
								<>
									<Divider />
									<ModalFooterWrapper
										orientation={centered ? 'vertical' : 'horizontal'}
										mainAlignment="flex-end"
										padding={{ top: "large" }}
									>
										{customFooter ? customFooter :
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
								</>
							)}
						</ModalContent>
					</ModalWrapper>
				</Transition>
				<div tabIndex={0} ref={endSentinelRef}></div>
			</ModalContainer>
		</Portal>
	);
});

Modal.propTypes = {
	/** Modal background */
	background: Container.propTypes.background,
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
	/** Hide the footer completely */
	hideFooter: PropTypes.bool,
	/** Show icon to close Modal */
	showCloseIcon: PropTypes.bool,
	/** Css property to handle the stack order of multiple modals */
	zIndex: PropTypes.number,
	/** max height of the modal body */
	maxHeight: PropTypes.string,
	/** Flag to disable the Portal implementation */
	disablePortal: PropTypes.bool
};

Modal.defaultProps = {
	type: 'default',
	size: 'small',
	centered: false,
	confirmLabel: 'OK',
	confirmColor: 'primary',
	copyLabel: 'Copy',
	showCloseIcon: false,
	zIndex: 999,
	background: 'gray6',
	maxHeight: '60vh',
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
				{optionalFooter}
			</OptionalFooterContainer>}
			<ButtonContainer orientation="horizontal" mainAlignment={centered ? 'center' : 'flex-end'}>
				{secondaryButton}
				<ConfirmButton color={confirmColor} onClick={onConfirm || onClose} label={confirmLabel} />
			</ButtonContainer>
		</>
	);
}

export default Modal;
