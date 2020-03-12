import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { find, map } from 'lodash';
import styled from 'styled-components';
import Text from '../primitive/Text';
import Container from '../primitive/Container';
import Avatar from '../primitive/Avatar';
import Divider from '../primitive/Divider';
import Icon from '../primitive/Icon';
import Padding from '../primitive/Padding';
import IconButton from "../primitive/IconButton";
import Collapse from "../utilities/Collapse";
import EmailListItem from "./EmailListItem";

const AvatarContainer = styled.div``;

const HoverAvatar = styled.div`
	background: ${({theme, selected}) => theme.colors.background[selected ? 'bg_1' : 'bg_7']};
	box-sizing: border-box;
	border: ${({theme, selecting}) => selecting ? `2px solid ${theme.colors.border.bd_2}` : 'none'};
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
	? theme.colors.hover.hv_1
	: (selecting
			? theme.colors.hover.hv_7
			: theme.colors.background.bg_5
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
	background: ${({theme, selected}) => theme.colors.background[selected ? 'bg_11' : 'bg_7']};
	& :hover {
		background: ${({theme}) => theme.colors.hover.hv_7}
	}
`;

function ConversationListItem({ conversation, emails, selected, selecting, onSelect, onDeselect }) {
	const [open, setOpen] = useState(false);
	const mainContact = useMemo(() => {
		return find(conversation.contacts, ['type', (conversation.folder === 'Sent' || conversation.folder === 'Drafts')? 't' : 'f'])
	}, conversation.contacts);
	return (
		<Container
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
						{ (selected || !selecting) && <Icon size="large" icon="Checkmark" color={selected ? 'txt_3' : 'txt_1'}/> }
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
							color={conversation.read ? 'txt_1' : 'txt_2'}
							weight={conversation.read ? 'regular' : 'bold'}
						>
							{mainContact.displayName || mainContact.address}
						</Text>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{conversation.attachment && <Padding horizontal="extrasmall"><Icon icon="Attach"/></Padding>}
							{conversation.flagged && <Padding horizontal="extrasmall"><Icon color="txt_5" icon="Flag"/></Padding>}
							<Text size="small" color="txt_4">{conversation.date}</Text>
						</Container>
					</Container>
					<Container
						orientation="horizontal"
						mainAlignment="space-between"
					>
						<Padding right="extrasmall">
							<Container
								background={conversation.read ? 'bg_10' : 'bg_1'}
								height="20px"
								width="fit"
								padding={{vertical: 'extrasmall', horizontal: 'small'}}
								style={{
									borderRadius: '8px'
								}}
							>
								<Text
									size="small"
									color={conversation.read ? 'txt_1' : 'txt_3'}
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
								color="txt_4"
							>
								{conversation.fragment}
							</Text>
						</Container>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{conversation.urgent && <Padding horizontal="extrasmall"><Icon color="txt_5" icon="ArrowUpward"/></Padding>}
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
}

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
