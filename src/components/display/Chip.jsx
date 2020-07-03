import React, { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Avatar from '../basic/Avatar';
import Text from '../basic/Text';
import Icon from '../basic/Icon';
import IconButton from '../inputs/IconButton';
import useKeyboard from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const ChipComp = styled.div`
	display: inline-flex;
  justify-content: space-between;
  align-items: center;
  max-width: 200px;
  min-height: ${({theme}) => theme.sizes.avatar.small.diameter};
	padding: ${({theme}) => theme.sizes.padding.extrasmall};
	background-color: ${({theme}) => theme.palette.gray4.regular};
	border-radius: 100vh;
	user-select: none;
	vertical-align: middle;
	
	&:focus{
		outline: 1px solid #eee;
	}
`;
const TextContainer = styled.div`
	max-width: 200px;
	padding: 0 ${({theme}) => theme.sizes.padding.extrasmall};
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;
const CloseButton = styled(IconButton)`
	width: ${({theme}) => theme.sizes.avatar.small.diameter};
	height: ${({theme}) => theme.sizes.avatar.small.diameter};
	padding: calc(${({theme}) => theme.sizes.padding.extrasmall} / 2);
`;

const Chip = React.forwardRef(function({ label, hasAvatar, picture, closable, onClose, ...rest }, ref) {
	const innerRef = useRef(undefined);
	const chipRef = useCombinedRefs(ref, innerRef);

	const onKeyDown = useCallback(() => onClose && onClose(), [onClose]);
	useKeyboard(chipRef, 'keydown', onKeyDown, ['Backspace', 'Delete']);

	return (
		<ChipComp {...rest} ref={chipRef}>
			{hasAvatar && (
				<Avatar size="small" label={label} colorLabel={label} picture={picture}/>
			)}
			<TextContainer>
				<Text size="small" weight="medium" color="secondary">{label}</Text>
			</TextContainer>
			{(closable || onClose) && (
				<CloseButton
					tabIndex={0}
					onClick={onClose}
					size="small"
					iconColor="secondary"
					icon="Close"
					borderRadius="round"
				/>
			)}
		</ChipComp>
	);
});

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
