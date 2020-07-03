import React, { useState, useCallback, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Container from "../layout/Container";
import Dropdown from '../display/Dropdown';
import Icon from '../basic/Icon';
import IconButton from '../inputs/IconButton';
import Text from '../basic/Text';
import Padding from '../layout/Padding';

const statusIcons = {
	pending: { icon: 'ClockOutline' },
	sent: { icon: 'Checkmark' },
	received: { icon: 'DoneAll' },
	viewed: { icon: 'DoneAll', color: 'primary' },
};
const fileIcons = {
	audio: 'Music',
	video: 'Video',
	image: 'Image',
	application: 'FileOutline',
	text: 'FileText'
};

function getAttachmentIcon(type, extension) {
	if (extension !== '' && extension.toLowerCase() === 'pdf') {
		return 'FileText';
	}
	return fileIcons[type] || 'FileOutline';
}
function getAttachmentType(fileType) {
	return fileType !== '' ? fileType.split('/')[0] : '';
}
function getAttachmentExtension(fileType) {
	return fileType !== '' ? fileType.split('/')[1] : '';
}
const ContactText = styled(Text)`
	color: ${(props) => props.contactColor ? props.theme.avatarColors['avatar_' + props.contactColor] : 'currentColor'};
	margin-bottom: ${(props) => props.theme.sizes.padding.extrasmall};
`;
function Contact({ contactName, contactColor }) {
	if (!contactName) return null;
	return (
		<ContactText weight="bold" contactColor={contactColor}>{ contactName }</ContactText>
	);
}

const Message = styled.span`
	${(props) => props.deleted && css`
		color: ${props.theme.palette.gray1.regular};
	`}
	${(props) => props.italic && css`
		font-style: italic;
	`};
	span {
		vertical-align: middle;
	}
	a {
		color: ${({theme}) => theme.palette.info.regular};
		text-decoration: underline;
		
		&:hover {
			color: ${({theme}) => theme.palette.info.hover};
		}
		&:focus {
			color: ${({theme}) => theme.palette.info.focus};
		}
		&:active {
			color: ${({theme}) => theme.palette.info.active};
		}
	}
`;
const MessageInfo = styled.span`
	position: absolute;
	bottom: calc(${(props) => props.theme.sizes.padding.medium} - 2px);
	right: ${(props) => props.theme.sizes.padding.medium};
	display: flex;
	justify-content: flex-end;
	align-items: center;
	float: right;
	padding-left: ${(props) => props.theme.sizes.padding.medium};
	transform: translateY(2px);
	min-width: 60px;
	font-size: ${(props) => props.theme.sizes.font.small};
	color: ${({ theme }) => theme.palette.gray1.regular};
	text-align: right;
	user-select: none;
  
	${(props) => props.italic && css`
		font-style: italic;
	`};
	${(props) => props.fake && css`
		position: static;
		visibility: hidden;
	`};
`;
const DropdownContainer = styled.div`
	position: absolute;
	display: flex;
	justify-content: flex-end;
	transition: 0.2s ease-out;
	opacity: 0;
	
	${({theme, hasAttachment, backgroundColor}) => !hasAttachment && css`
		top: 3px;
		right: ${theme.sizes.padding.small};
		width: 48px;
		height: 27px;
		background-image: radial-gradient(ellipse at 100%, ${theme.palette[backgroundColor].regular} 35%, transparent 100%);
		color: ${theme.palette.text.regular};
	`}
	${({theme, hasAttachment, isUserMessage}) => hasAttachment && css`
		top: ${theme.sizes.padding.extrasmall};
		right: ${theme.sizes.padding.extrasmall};
		width: 100px;
		height: 27px;
		background-image: linear-gradient(15deg, transparent 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.12) 70%, rgba(0,0,0,0.33) 100%);
		border-radius: ${isUserMessage ? '6px 0 0 0 0' : '0 6px 0 0'};
		color: #fff;
	`};

	${({isActive}) => isActive && css`
		opacity: 1;
	`};
`;
const BubbleWrapper = styled(Container)`
	position: relative;
	flex-wrap: wrap;
	align-items: initial;	
	margin-bottom: 2px;
	border-radius: ${(props) => props.isUserMessage ? '6px 0 0 6px' : '0 6px 6px 0'};
	max-width: 75%;

	${(props) => props.lastMessageSequence && css`
		margin-bottom: ${props.theme.sizes.padding.small};
		border-radius: ${props.isUserMessage ? '6px 0 6px 6px' : '0 6px 6px 6px'};
	`};
	${(props) => props.isUserMessage && css`
		align-self: flex-end;
		margin-left: ${props.theme.sizes.padding.large};
	`};
	${(props) => !props.isUserMessage && css`
		align-self: flex-start;
		margin-right: ${props.theme.sizes.padding.large}; 
	`};
	${(props) => props.disableMaxWidth && css`
		max-width: calc(100% - ${props.theme.sizes.padding.large} - 8px);
	`};
	${(props) => props.hasAttachment && !props.disableMaxWidth && css`
		max-width: 324px;
	`};
	:hover {
		${DropdownContainer} {
			opacity: 1;
		}
	}
`;

function MessageFooter({ isUserMessage, date, edited, editedLabel, status }) {
	const content =
		<>
			{ !isUserMessage && edited && <Padding right="small"><i>{ editedLabel }</i></Padding> }
			{ isUserMessage && <Padding right="extrasmall"><Icon size="small" color={statusIcons[status].color || 'gray1'} icon={statusIcons[status].icon} /></Padding> }
			{ date }
		</>;
	return (
		<>
			<MessageInfo fake={true}>{ content }</MessageInfo>
			<MessageInfo>{ content }</MessageInfo>
		</>
	);
}
function MessageContent({
	isUserMessage,
	message,
	date,
	edited,
	editedLabel,
	deleted,
	deletedLabel,
	status,
	hasAttachment,
	attachmentExtension,
	attachmentSize
}) {
	if (deleted) {
		return (
			<Fragment>
				<Message deleted={true} italic={true}>{ deletedLabel }</Message>
				<MessageInfo fake={true} italic={true}>{ date }</MessageInfo>
				<MessageInfo italic={true}>{ date }</MessageInfo>
			</Fragment>
		);
	}

	return (
		<Fragment>
			{ message && <Message>{ message }</Message> }
			{ !hasAttachment &&
				<MessageFooter
					isUserMessage={isUserMessage}
					date={date}
					edited={edited}
					editedLabel={editedLabel}
					status={status}
				/>
			}
			{ hasAttachment &&
				<AttachmentMessageFooter
					isUserMessage={isUserMessage}
					date={date}
					edited={edited}
					editedLabel={editedLabel}
					status={status}
					attachmentExtension={attachmentExtension}
					attachmentSize={attachmentSize}
				/>
			}
		</Fragment>
	);
}
const MessageBubble = React.forwardRef(function({
	message,
	date,
	status,
	position,
	contactName,
	contactColor,
	firstMessageSequence,
	lastMessageSequence,
	disableMaxWidth,
	edited,
	editedLabel,
	deleted,
	deletedLabel,
	disableContactName,
	attachmentOnClick,
	attachmentImage,
	imageOnLoad,
	imageOnError,
	attachmentMime,
	attachmentName,
	attachmentSize,
	attachmentDeleted,
	replyMessage,
	replyContactName,
	replyContactColor,
	replyAttachmentImage,
	replyAttachmentMime,
	replyAttachmentName,
	actions
}, ref) {
	const [dropdownActive, setDropdownActive] = useState(false);
	const isUserMessage = useMemo(() => position !== 'left', [position]);
	const backgroundColor = useMemo(() => deleted ? 'gray3' : (isUserMessage ? 'highlight' : 'gray6'), [deleted, isUserMessage]);
	const hasAttachment = useMemo(() => attachmentOnClick && attachmentName, [attachmentOnClick, attachmentName]);
	const attachmentType = useMemo(() => getAttachmentType(attachmentMime), [attachmentMime]);
	const attachmentExtension = useMemo(() => getAttachmentExtension(attachmentMime), [attachmentMime]);

	const onDropdownOpen = useCallback(() => setDropdownActive(true), [setDropdownActive]);
	const onDropdownClose = useCallback(() => setDropdownActive(false), [setDropdownActive]);

	return (
		<BubbleWrapper
			ref={ref}
			lastMessageSequence={lastMessageSequence}
			isUserMessage={isUserMessage}
			disableMaxWidth={disableMaxWidth}
			background={backgroundColor}
			hasAttachment={hasAttachment}
			mainAlignment="flex-start"
			width="fit-content"
		>
			{
				hasAttachment && !deleted &&
					<AttachmentPreview
						isUserMessage={isUserMessage}
						previewImage={attachmentImage}
						imageOnLoad={imageOnLoad}
						imageOnError={imageOnError}
						deleted={attachmentDeleted}
						name={attachmentName}
						type={attachmentType}
						extension={attachmentExtension}
						onClick={attachmentOnClick}
					/>
			}
			<Padding vertical="small" horizontal="medium" style={{ width: '100%', boxSizing: 'border-box' }}>
				{
					firstMessageSequence && !disableContactName && !isUserMessage &&
						<Contact contactName={contactName} contactColor={contactColor} />
				}
				<ReplyMessage
					message={replyMessage}
					position={position}
					contactColor={replyContactColor}
					contactName={replyContactName}
					attachmentImage={replyAttachmentImage}
					attachmentMime={replyAttachmentMime}
					attachmentName={replyAttachmentName}
				/>
				<Text overflow="break-word">
					<MessageContent
						isUserMessage={isUserMessage}
						message={message}
						date={date}
						edited={edited}
						editedLabel={editedLabel}
						deleted={deleted}
						deletedLabel={deletedLabel}
						status={status}
						hasAttachment={hasAttachment}
						attachmentExtension={attachmentExtension}
						attachmentSize={attachmentSize}
					/>
				</Text>
			</Padding>
			{ actions &&
				<DropdownContainer
					isActive={dropdownActive}
					backgroundColor={backgroundColor}
					hasAttachment={hasAttachment}
					isUserMessage={isUserMessage}
				>
					<Dropdown
						items={actions}
						onOpen={onDropdownOpen}
						onClose={onDropdownClose}
						disableRestoreFocus={true}
					>
						<IconButton iconColor="currentColor" size="small" icon="ArrowIosDownward" />
					</Dropdown>
				</DropdownContainer>
			}
		</BubbleWrapper>
	);
});

MessageBubble.propTypes = {
	/** Text content of message */
	message: PropTypes.element,
	/** Date of message */
	date: PropTypes.string,
	/** Status of message */
	status: PropTypes.oneOf(['pending', 'sent', 'received', 'viewed']),
	/** Position of message */
	position: PropTypes.oneOf(['left', 'right']),
	/** Message sender's name */
	contactName: PropTypes.string,
	/** Message sender's color scheme */
	contactColor: PropTypes.string,
	/** Is the message the first of sequence? */
	firstMessageSequence: PropTypes.bool,
	/** Is the message the last of sequence? */
	lastMessageSequence: PropTypes.bool,
	/** By default the message can spread only 75% of his container. To disable this behavior (E.g. in the mini chat), pass true */
	disableMaxWidth: PropTypes.bool,
	/** Has the message been edited? */
	edited: PropTypes.bool,
	/** Property to localize the string shown when a message has been edited */
	editedLabel: PropTypes.string,
	/** Has the message been deleted? */
	deleted: PropTypes.bool,
	/** Property to localize the string shown when a message has been deleted */
	deletedLabel: PropTypes.string,
	/** Property to disable the contact name (useful in the single chat context) */
	disableContactName: PropTypes.bool,
	/** Callback function, called when the user click's on the attachment */
	attachmentOnClick: PropTypes.func,
	/** Attachment preview image */
	attachmentImage: PropTypes.string,
	/** Attachments's mime */
	attachmentMime: PropTypes.string,
	/** File name of attachment */
	attachmentName: PropTypes.string,
	/** Size of attachment */
	attachmentSize: PropTypes.string,
	/** Is the attachment deleted? */
	attachmentDeleted: PropTypes.bool,
	/** Callback for attachmentImage onLoad event */
	imageOnLoad: PropTypes.func,
	/** Callback for attachmentImage onError event */
	imageOnError: PropTypes.func,
	/** Reply message text */
	replyMessage: PropTypes.string,
	/** Reply message Contact name */
	replyContactName: PropTypes.string,
	/** Reply message Contact color scheme */
	replyContactColor: PropTypes.string,
	/** Reply message attachment preview image */
	replyAttachmentImage: PropTypes.string,
	/** Reply message attachment's mime */
	replyAttachmentMime: PropTypes.string,
	/** Reply message attachment file name */
	replyAttachmentName: PropTypes.string,
	/** Actions shown in the dropdown, activable on hover */
	actions: Dropdown.propTypes.items
};

MessageBubble.defaultProps = {
	status: 'pending',
	position: 'right',
	firstMessageSequence: false,
	lastMessageSequence: false,
	disableMaxWidth: false,
	edited: false,
	editedLabel: 'edited',
	deleted: false,
	deletedLabel: 'Deleted message',
	disableContactName: false,
	attachmentMime: '',
	attachmentDeleted: false,
	replyAttachmentMime: ''
};

const AttachmentContainer = styled(Container)`
	position: relative;
	width: calc(100% - ${(props) => props.theme.sizes.padding.small});
	margin: ${(props) => `${props.theme.sizes.padding.extrasmall} ${props.theme.sizes.padding.extrasmall} 0`};
	cursor: ${(props) => props.onClick ? 'pointer' : 'normal'};
	border-radius: ${(props) => props.isUserMessage ? '6px 0 0 0' : '0 6px 0 0'};
	overflow: hidden;
	@supports (object-fit: cover) {
		align-items: initial;
	}
`;
const AttachmentImage = styled.img`
	display: block;
	max-width: 100%;
	object-fit: cover;
	min-height: 40px;
`;
const AttachmentImageName = styled(Text)`
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	padding: ${(props) => props.theme.sizes.padding.small};
	color: #fff;
	background: linear-gradient(to top, #333 -20%, rgba(30, 30, 30, 0) 100%);
	box-sizing: border-box;
`;
const AttachmentDeleted = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 80px;
	min-width: 180px;
	padding: ${({theme}) => `${theme.sizes.padding.large} ${theme.sizes.padding.medium}`};
	background-color: ${(props) => props.theme.palette.gray5.regular};

	> svg {
    width: 35px;
    height: 35px;
    opacity: 0.2;
	}
`;
const AttachmentContent = styled(Text)`
	display: flex;
	align-items: center;
	padding: ${(props) => props.theme.sizes.padding.small};
	background-color: ${(props) => props.theme.palette.text.regular};
	width: 100%;
	box-sizing: border-box;
`;
const AttachmentName = styled.span`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 0;
	overflow: hidden;
	text-overflow: ellipsis;
`;

function AttachmentPreview({
	name,
	previewImage,
	imageOnLoad,
	imageOnError,
	deleted,
	type,
	extension,
	onClick,
	isUserMessage
}) {
	const isImage = useMemo(() => !deleted && previewImage && type === 'image', [previewImage, type, deleted]);
	const icon = useMemo(() => getAttachmentIcon(type, extension), [type, extension]);

	return (
		<AttachmentContainer isUserMessage={isUserMessage} onClick={onClick} height="auto">
			{ !deleted && previewImage && <AttachmentImage src={previewImage} onLoad={imageOnLoad} onError={imageOnError} /> }
			{ isImage && <AttachmentImageName>{ name }</AttachmentImageName> }
			{ deleted && <AttachmentDeleted><Icon size="large" icon="ImageOutline" color="gray1" /></AttachmentDeleted> }
			{ !isImage &&
				<AttachmentContent color="gray6">
					<Padding right="small">
						<Icon color="gray6" size="large" icon={icon} />
					</Padding>
					<AttachmentName>{name}</AttachmentName>
				</AttachmentContent>
			}
		</AttachmentContainer>
	);
}

const AttachmentFooterContainer = styled.div`
	&:not(:first-child) {
		margin-top: 6px;
	}
`;
const AttachmentInfoText = styled(Text)`
	display: inline;
	text-transform: uppercase;
	
	> span{
		&:not(:last-child) {
			&:after {
				content: '•';
				padding: 0 ${(props) => props.theme.sizes.padding.extrasmall};
			}
		}
	}
`;
function AttachmentMessageFooter({
	isUserMessage,
	date,
	edited,
	editedLabel,
	status,
	attachmentExtension,
	attachmentSize
}) {
	return (
		<AttachmentFooterContainer>
			<AttachmentInfoText size="small" color="gray1">
				{ attachmentExtension && <span>{ attachmentExtension }</span> }
				{ attachmentSize && <span>{ attachmentSize }</span> }
			</AttachmentInfoText>
			<MessageFooter
				isUserMessage={isUserMessage}
				date={date}
				edited={edited}
				editedLabel={editedLabel}
				status={status}
			/>
		</AttachmentFooterContainer>
	);
}

const ReplyMessageContainer = styled(Container)`
	color: ${(props) =>
		props.contactColor ?
			props.theme.avatarColors['avatar_' + props.contactColor]
			: props.theme.palette.primary.regular
	};
	border-left: 2px solid currentColor;
	padding-left: ${(props) => props.theme.sizes.padding.small};
	margin-bottom: ${(props) => props.theme.sizes.padding.small};
	height: auto;
	width: auto;
`;
const ReplyAttachmentImage = styled.div`
	background-image: url(${props => props.image});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	width: 40px;
	height: 40px;
	margin-right: ${(props) => props.theme.sizes.padding.small};
	border-radius: ${(props) => props.theme.borderRadius};
`;
const ReplyAttachmentPreview = styled.div`
	background-color: ${(props) => props.theme.palette.gray0.regular};
	margin-right: ${(props) => props.theme.sizes.padding.small};
	border-radius: ${(props) => props.theme.borderRadius};
	padding: ${(props) => props.theme.sizes.padding.small};
`;
const ReplyMessageContent = styled.div`
	flex-grow: 1;
	flex-basis: 0;
	min-width: 1px;
`;

const ReplyMessage = React.forwardRef(function({
	message,
	position,
	contactName,
	contactColor,
	attachmentMime='',
	attachmentName,
	attachmentImage
}, ref) {
	const hasAttachment = !!attachmentName;
	const attachmentType = useMemo(() => getAttachmentType(attachmentMime), [attachmentMime]);
	const attachmentExtension = useMemo(() => getAttachmentExtension(attachmentMime), [attachmentMime]);
	const isImage = useMemo(() => attachmentType === 'image', [attachmentType]);
	const attachmentIcon = useMemo(() => !isImage ? getAttachmentIcon(attachmentType, attachmentExtension) : '', [attachmentExtension, isImage]);
	const textMessage = useMemo(() => message || attachmentName || false, [message, attachmentName]);

	if (!textMessage) return null;
	return (
		<ReplyMessageContainer
			ref={ref}
			orientation="horizontal"
			crossAlignment="center"
			borderRadius="none"
			position={position}
			contactColor={contactColor}
		>
			{ hasAttachment && isImage && <ReplyAttachmentImage image={attachmentImage} /> }
			{ hasAttachment && !isImage && <ReplyAttachmentPreview><Icon color="gray6" size="large" icon={attachmentIcon} /></ReplyAttachmentPreview> }
			<ReplyMessageContent>
				<Contact weight="medium" contactName={contactName} />
				<Text overflow="break-word" color="gray1" style={{fontStyle: 'italic'}}>{ textMessage }</Text>
			</ReplyMessageContent>
		</ReplyMessageContainer>
	);
});

export { MessageBubble, ReplyMessage };
