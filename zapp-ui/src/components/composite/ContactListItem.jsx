import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from '../basic/Text';
import Container from '../layout/Container';
import Avatar from '../basic/Avatar';
import Divider from '../layout/Divider';
import Icon from '../basic/Icon';
import Padding from '../layout/Padding';
import IconButton from '../inputs/IconButton';

const AvatarContainer = styled.div``;

const HoverArea = styled.div`
	background: ${
		({theme, selected}) => (selected ? theme.palette.primary.regular : 'none')
	};
	width: ${({theme}) => theme.sizes.avatar.medium.diameter};
	min-width: ${({theme}) => theme.sizes.avatar.medium.diameter};
	height: ${({theme}) => theme.sizes.avatar.medium.diameter};
	min-height: ${({theme}) => theme.sizes.avatar.medium.diameter};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	&:hover {
		background: ${({theme}) => theme.palette.highlight.hover};
	 > ${AvatarContainer} {
	 	display: none;
	 }
	}
`;

const ContactListItem = React.forwardRef(function({ contact, selected, onSelect, onDeselect, actions }, ref) {
	const [ itemHover, setItemHover ] = useState(false);
	return (
		<Container
			ref={ref}
			orientation="vertical"
			width="fill"
			height="fit"
			onMouseEnter={(ev) => {
				ev.persist();
				setItemHover(true);
			}}
			onMouseLeave={(ev) => {
				ev.persist();
				setItemHover(false);
			}}
			style={{
				cursor: 'pointer'
			}}
		>
			<Container
				orientation="horizontal"
				width="fill"
				height="fit"
				mainAlignment="flex-start"
				crossAlignment="flex-start"
				background={itemHover ? 'gray4' : (selected ? 'highlight' : 'gray6')}
			>
				<Padding all="small">
					<HoverArea
						selected={selected}
						onClick={() => selected? onDeselect() : onSelect()}
					>
						{ !selected &&
							<AvatarContainer>
								<Avatar
									label={`${contact.firstName} ${contact.lastName}`}
									picture={contact.image}
									size="medium"
								/>
							</AvatarContainer>
						}
						{ selected &&
							<Icon size="large" icon="Checkmark" color="gray6"/>
						}
					</HoverArea>
				</Padding>
				<Container
					orientation="vertical"
					width="fill"
					mainAlignment="flex-start"
					crossAlignment="flex-start"
					padding={{ vertical: 'small' }}
				>
					<Padding bottom="extrasmall">
						<Text size="large" overflow="ellipsis">
							{`${contact.firstName} ${contact.lastName}`}
						</Text>
					</Padding>
					<Text size="small" color="secondary" overflow="ellipsis">
						{contact.email}
					</Text>
				</Container>
				{ (itemHover && !selected) &&
					<Container
						width="fill"
						height="fit"
						orientation="horizontal"
						mainAlignment="flex-end"
						padding={{all: 'extrasmall'}}
					>
						{
							actions.map((action, index) => (
								<IconButton key={index} icon={action.icon} onClick={action.click}/>
							))
						}
					</Container>
				}
			</Container>
			<Divider/>
		</Container>
	);
});

ContactListItem.propTypes = {
	contact: PropTypes.shape(
		{
			firstName: PropTypes.string,
			lastName: PropTypes.string,
			nickName: PropTypes.string,
			image: PropTypes.string,
			jobTitle: PropTypes.string,
			email: PropTypes.string,
			department: PropTypes.string
		}
	).isRequired,
	selected: PropTypes.bool,
	actions: PropTypes.arrayOf(
		PropTypes.shape(
			{
				icon: PropTypes.string,
				label: PropTypes.string,
				click: PropTypes.func
			}
		)
	),
	onSelect: PropTypes.func,
	onDeselect: PropTypes.func,
};

ContactListItem.defaultProps = {
	selected: false
};

export default ContactListItem;
