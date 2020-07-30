import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { find, map } from 'lodash';
import styled from 'styled-components';
import Text from '../basic/Text';
import Container from '../layout/Container';
import Avatar from '../basic/Avatar';
import Divider from '../layout/Divider';
import Icon from '../basic/Icon';
import Padding from '../layout/Padding';
import IconButton from "../inputs/IconButton";
import Collapse from "../utilities/Collapse";
import EmailListItem from "./EmailListItem";

const AvatarContainer = styled.div``;

const HoverAvatar = styled.div`
	background: ${({theme, selected}) => theme.palette[selected ? 'primary' : 'gray6'].regular};
	box-sizing: border-box;
	border: ${({theme, selecting}) => selecting ? `2px solid ${theme.palette.primary.regular}` : 'none'};
	width: ${({theme}) => theme.sizes.avatar.medium.diameter};
	min-width: ${({theme}) => theme.sizes.avatar.medium.diameter};
	height: ${({theme}) => theme.sizes.avatar.medium.diameter};
	min-height: ${({theme}) => theme.sizes.avatar.medium.diameter};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		background: ${({theme, selected, selecting}) => selected
	? theme.palette.primary.regular
	: (selecting
			? theme.palette.gray6.hover
			: theme.palette.gray2.regular
	)
};
	> ${AvatarContainer} {
		display: none;
	}
	}
`;
const PaddedText = styled(Container)`
	max-width: 100%;
`;

const HoverContainer = styled(Container)`
	background: ${({theme, selected}) => theme.palette[selected ? 'highlight' : 'gray6'].regular};
	& :hover {
		background: ${({theme}) => theme.palette.gray6.hover}
	}
`;

const ConversationListItem = React.forwardRef(function({ conversation, emails, selected, selecting, onSelect, onDeselect }, ref) {
	const [open, setOpen] = useState(false);
	const mainContact = useMemo(() => {
		return find(conversation.contacts, ['type', (conversation.folder === 'Sent' || conversation.folder === 'Drafts')? 't' : 'f'])
	}, conversation.contacts);
	return (
		<Container
			ref={ref}
			orientation="vertical"
			width="fill"
			height="fit"
			style={{
				cursor: 'pointer'
			}}
		>
			<HoverContainer
				orientation="horizontal"
				width="100%"
				height="fit"
				mainAlignment="flex-start"
				style={{ position: 'relative' }}
			>
				<Padding all="small">
					<HoverAvatar
						selected={selected}
						selecting={selecting}
						onClick={() => selected? onDeselect() : onSelect()}
					>
						{ !selecting &&
						<AvatarContainer>
							<Avatar
								label={mainContact.displayName || mainContact.address}
								colorLabel={mainContact.address}
								size="medium"
							/>
						</AvatarContainer>
						}
						{ (selected || !selecting) && <Icon size="large" icon="Checkmark" color={selected ? 'gray6' : 'text'}/> }
					</HoverAvatar>
				</Padding>
				<Container
					orientation="vertical"
					width="calc(100% - 48px)"
					mainAlignment="flex-start"
					crossAlignment="flex-start"
					padding={{ vertical: 'small', right: 'small' }}
				>
					<Container
						orientation="horizontal"
						mainAlignment="space-between"
						width="fill"
						padding={{bottom: 'extrasmall'}}
					>
						<Text
							color={conversation.read ? 'text' : 'primary'}
							weight={conversation.read ? 'regular' : 'bold'}
						>
							{mainContact.displayName || mainContact.address}
						</Text>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{conversation.attachment && <Padding horizontal="extrasmall"><Icon icon="Attach"/></Padding>}
							{conversation.flagged && <Padding horizontal="extrasmall"><Icon color="error" icon="Flag"/></Padding>}
							<Text size="small" color="secondary">{conversation.date}</Text>
						</Container>
					</Container>
					<Container
						orientation="horizontal"
						mainAlignment="space-between"
					>
						<Padding right="extrasmall">
							<Container
								background={conversation.read ? 'gray4' : 'primary'}
								height="20px"
								width="fit"
								padding={{vertical: 'extrasmall', horizontal: 'small'}}
								style={{
									borderRadius: '8px'
								}}
							>
								<Text
									size="small"
									color={conversation.read ? 'text' : 'gray6'}
								>
									{conversation.msgCount}
								</Text>
							</Container>
						</Padding>
						<Container
							orientation="horizontal"
							mainAlignment="flex-start"
							crossAlignment="flex-end"
							width="fill"
							style={{ minWidth: '0' }}
						>
							<PaddedText
								padding={{ right: 'extrasmall' }}
								width="fit"
							>
								<Text
									weight={conversation.read ? 'regular' : 'bold'}
									size="large"
								>
									{conversation.subject}
								</Text>
							</PaddedText>
							<Text
								color="secondary"
							>
								{conversation.fragment}
							</Text>
						</Container>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{conversation.urgent && <Padding horizontal="extrasmall"><Icon color="error" icon="ArrowUpward"/></Padding>}
							<IconButton size="small" icon={open ? 'ChevronUp' : 'ChevronDown'} onClick={() => setOpen(!open)}/>
						</Container>
					</Container>
				</Container>
			</HoverContainer>
			<Divider/>
			<Collapse open={open} orientation="vertical" crossSize="100%">
				<Container
					height="fit"
					width="fill"
					padding={{left: 'medium'}}
				>
					{map(emails, (email, index) => <EmailListItem key={index} email={email} selectable={false}/>)}
				</Container>
			</Collapse>
		</Container>
	);
});

ConversationListItem.propTypes = {
	conversation: PropTypes.shape(
		{
			attachment:	PropTypes.bool,
			contacts:	PropTypes.arrayOf(
				PropTypes.shape({
					type: PropTypes.oneOf(['f', 't', 'c', 'b', 'r', 's', 'n', 'rf']),
					address: PropTypes.string,
					displayName: PropTypes.string
				})
			),
			date:	PropTypes.string,
			flagged:	PropTypes.bool,
			folder:	PropTypes.string,
			fragment:	PropTypes.string,
			id:	PropTypes.string,
			messages:	PropTypes.arrayOf(PropTypes.string),
			msgCount:	PropTypes.number,
			read:	PropTypes.bool,
			size:	PropTypes.number,
			subject:	PropTypes.string,
			unreadMsgCount:	PropTypes.number,
			urgent:	PropTypes.bool,
		}
	).isRequired,
	selecting: PropTypes.bool,
	selected: PropTypes.bool,
	onSelect: PropTypes.func,
	onDeselect: PropTypes.func,
};

ConversationListItem.defaultProps = {
	selected: false
};

export default ConversationListItem;
