import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import styled from 'styled-components';
import Text from '../basic/Text';
import Container from '../layout/Container';
import Avatar from '../basic/Avatar';
import Divider from '../layout/Divider';
import Icon from '../basic/Icon';
import Padding from '../layout/Padding';

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
	${({theme, selected, selecting, selectable}) => selectable ?
	`&:hover {
		background: ${selected 
			? theme.palette.primary.hover 
			: (selecting
					? theme.palette.gray6.hover
					: theme.palette.gray2.regular
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
	background: ${({theme, selected}) => theme.palette[selected ? 'highlight' : 'gray6'].regular};
	& :hover {
		background: ${({theme}) => theme.palette.gray6.hover}
	}
`;

const EmailListItem = React.forwardRef(function({ email, selected, selecting, onSelect, onDeselect, folder, selectable }, ref) {
	const mainContact = useMemo(() => {
		return find(email.contacts, ['type', (folder === 'Sent' || folder === 'Drafts')? 't' : 'f'])
	}, email.contacts);
	return (
		<HoverContainer
			ref={ref}
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
							color={email.read ? 'text' : 'primary'}
							weight={email.read ? 'regular' : 'bold'}
						>
							{mainContact.displayName || mainContact.address}
						</Text>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{email.attachment && <Padding horizontal="extrasmall"><Icon icon="Attach"/></Padding>}
							{email.flagged && <Padding horizontal="extrasmall"><Icon color="error" icon="Flag"/></Padding>}
							<Text size="small" color="secondary">{email.date}</Text>
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
								color="secondary"
							>
								{email.fragment}
							</Text>
						</Container>
						<Container
							orientation="horizontal"
							width="fit"
						>
							{email.urgent && <Padding horizontal="extrasmall"><Icon color="error" icon="ArrowUpward"/></Padding>}
							{folder &&
								<Container
									background={email.read ? 'gray4' : 'primary'}
									height="20px"
									width="fit"
									padding={{vertical: 'extrasmall', horizontal: 'small'}}
									style={{
										borderRadius: '6px'
									}}
								>
									<Text
										size="small"
										color={email.read ? 'text' : 'gray6'}
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
});

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
