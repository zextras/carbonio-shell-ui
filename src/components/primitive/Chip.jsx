import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from "./Avatar";
import Text from "./Text";
import Icon from "./Icon";

const ChipComp = styled.div`
	display: inline-flex;
  justify-content: space-between;
  align-items: center;
  max-width: 200px;
  min-height: ${props => props.theme.sizes.avatar.small.diameter};
	padding: ${props => props.theme.sizes.padding.extrasmall};
	background-color: ${props => props.theme.colors.background.bg_10};
	border-radius: 100vh;
	user-select: none;
	vertical-align: middle;
	
	&:focus{
		outline: 1px solid #eee;
	}
`;
const TextContainer = styled.div`
	max-width: 200px;
	padding: 0 ${props => props.theme.sizes.padding.extrasmall};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
const CloseButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${props => props.theme.sizes.avatar.small.diameter};
	height: ${props => props.theme.sizes.avatar.small.diameter};
	padding: calc(${props => props.theme.sizes.padding.extrasmall} / 2);
	border: none;
	border-radius: 50%;
	cursor: pointer;
		
	svg{
		display: block;
	}
	&:focus{
		outline: 1px solid #eee;
	}
`;

function Chip({ label, hasAvatar, picture, closable, onClose, ...rest }) {
	const chipRef = useRef(null);

	function onKeyDown(e) {
		if (e.code === 'Backspace' || e.code === 'Delete') {
			e.preventDefault();
			(closable || onClose) && onClose();
			return false;
		}
	}

	useEffect(() => {
		chipRef.current.addEventListener('keydown', onKeyDown);
		return () => chipRef.current.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<ChipComp {...rest} ref={chipRef} tabIndex={0}>
			{hasAvatar && (
				<Avatar size="small" label={label} colorLabel={label} picture={picture}/>
			)}
			<TextContainer>
				<Text size="small" weight="medium" color="txt_4">{label}</Text>
			</TextContainer>
			{(closable || onClose) && (
				<CloseButton tabIndex={-1} onClick={onClose}>
					<Icon size="small" color="txt_4" icon="Close"/>
				</CloseButton>
			)}
		</ChipComp>
	);
};

Chip.propTypes = {
	/** Chip content text */
	label: PropTypes.string.isRequired,
	/** Has Chip an Avatar? */
	hasAvatar: PropTypes.bool,
	/** Chip Avatar picture */
	picture: PropTypes.string,
	/** Is Chip closable? */
	closable: PropTypes.bool,
	/** Callback to call when user tries to remove the Chip */
	onClose: PropTypes.func
};

Chip.defaultProps = {
	hasAvatar: true,
	picture: '',
	closable: false
};

export default Chip;
