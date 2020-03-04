import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import styled from 'styled-components';
import Text from '../primitive/Text';
import Container from '../primitive/Container';
import Avatar from '../primitive/Avatar';
import Divider from '../primitive/Divider';
import Icon from '../primitive/Icon';
import Padding from '../primitive/Padding';

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
	${({theme, selected, selecting, selectable}) => selectable ?
	`&:hover {
		background: ${selected 
			? theme.colors.hover.hv_1 
			: (selecting
					? theme.colors.hover.hv_7
					: theme.colors.background.bg_5
				)
			};
	 > ${AvatarContainer} {
	 	display: none;
	 }
	}` : ''}
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

const EmailListItem = ({ email, selected, selecting, onSelect, onDeselect, folder, selectable }) => {
	const mainContact = useMemo(() => {
		return find(email.contacts, ['type', (folder === 'Sent' || folder === 'Drafts')? 't' : 'f'])
	}, email.contacts);
	return (
		<HoverContainer
			orientation="vertical"
			width="fill"
			height="fit"
			style={{
				cursor: 'pointer'
			}}
		>
			<Container
				orientation="horizontal"
				width="100%"
				height="fit"
				mainAlignment="flex-start"
				style={{ position: 'relative' }}
			>
				<Padding all="small">
					<HoverAvatar
						selectable={selectable}
						selected={selected}
						selecting={selecting}
						onClick={() => selected
							? onDeselect && onDeselect()
							: onSelect && onSelect()
						}
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
							color={email.read ? 'txt_1' : 'txt_2'}
							weight={email.read ? 'regular' : 'bold'}
						>
							{mainContact.displayName || mainContact.address}
						</Text>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{email.attachment && <Padding horizontal="extrasmall"><Icon icon="Attach"/></Padding>}
							{email.flagged && <Padding horizontal="extrasmall"><Icon color="txt_5" icon="Flag"/></Padding>}
							<Text size="small" color="txt_4">{email.date}</Text>
						</Container>
					</Container>
					<Container
						orientation="horizontal"
						mainAlignment="space-between"
					>
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
									weight={email.read ? 'regular' : 'bold'}
									size="large"
								>
									{email.subject}
								</Text>
							</PaddedText>
							<Text
								color="txt_4"
							>
								{email.fragment}
							</Text>
						</Container>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{email.urgent && <Padding horizontal="extrasmall"><Icon color="txt_5" icon="ArrowUpward"/></Padding>}
							{folder &&
								<Container
									background={email.read ? 'bg_10' : 'bg_1'}
									height="20px"
									width="fit"
									padding={{vertical: 'extrasmall', horizontal: 'small'}}
									style={{
										borderRadius: '6px'
									}}
								>
									<Text
										size="small"
										color={email.read ? 'txt_1' : 'txt_3'}
									>
										{folder}
									</Text>
								</Container>
							}
						</Container>
					</Container>
				</Container>
			</Container>
			<Divider/>
		</HoverContainer>
	);
};

EmailListItem.propTypes = {
	folder: PropTypes.string,
	email: PropTypes.shape(
		{
			conversation: PropTypes.string,
			contacts: PropTypes.arrayOf(
				PropTypes.shape({
					type: PropTypes.oneOf(['f', 't', 'c', 'b', 'r', 's', 'n', 'rf']),
					address: PropTypes.string,
					displayName: PropTypes.string
				})
			),
			date: PropTypes.string,
			subject: PropTypes.string,
			fragment: PropTypes.string,
			size: PropTypes.number,
			read: PropTypes.bool,
			attachment: PropTypes.bool,
			flagged: PropTypes.bool,
			urgent: PropTypes.bool,
			bodyPath: PropTypes.string
		}
	).isRequired,
	selectable: PropTypes.bool,
	selected: PropTypes.bool,
	selecting: PropTypes.bool,
	onSelect: PropTypes.func,
	onDeselect: PropTypes.func,
};

EmailListItem.defaultProps = {
	selectable: true,
	selected: false,
	selecting: false
};

export default EmailListItem;
