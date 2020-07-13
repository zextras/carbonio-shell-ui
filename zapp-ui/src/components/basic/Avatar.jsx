import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import defaultTheme from '../../theme/Theme';

const AvatarContainer = styled.div`
	width: ${props => props.theme.sizes.avatar[props.size].diameter};
	min-width: ${props => props.theme.sizes.avatar[props.size].diameter};
	height: ${props => props.theme.sizes.avatar[props.size].diameter};
	min-height: ${props => props.theme.sizes.avatar[props.size].diameter};
	background: ${props => props.theme.avatarColors[props.background]} url(${props => props.picture}) no-repeat;
	background-size: contain;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Capitals = styled.p`
	font-size: ${props => props.theme.sizes.avatar[props.size].font};
	color: ${props => props.theme.palette.gray6.regular};
	font-family: ${props => props.theme.fonts['default']};
	font-weight: ${props => props.theme.fonts.weight['regular']};
	user-select: none;
`;

const _SPECIAL_CHARS_REGEX = /[&/\\#,+()$~%.'":*?!<>{}@^_`=]/g;
const _WHITESPACE_REGEX = /[ ]/g;
const _WHITESPACE_REGEX_2 = / /;

function calcCapitals(label) {
	const noSpecString = label.replace(_SPECIAL_CHARS_REGEX, '');
	if (noSpecString.replace(_WHITESPACE_REGEX, '').length !== 0) {
		label = noSpecString;
	}
	else { return '?' }

	if (label.replace(_WHITESPACE_REGEX, '').length === 0) {
		return '?';
	}
	if (label.length <= 2) {
		return label;
	}
	if (_WHITESPACE_REGEX_2.test(label)) {

		let words = label.split(' ');
		words = words.filter((word) => word !== '');

		if (words.length < 2) {
			return words[0][0] + words[0][words.length -1];
		}

		return words[0][0] + words[words.length -1][0];
	}
	return label[0] + label[label.length -1];
}

function calcColor(label) {
	let sum = 0;
	for (let i = 0; i < label.length; i++) {
		sum += label.charCodeAt(i);
	}
	return `avatar_${(sum % 50) +1}`;
}

const Avatar = React.forwardRef(function({size, label, colorLabel, picture}, ref) {
	const color = calcColor(colorLabel || label);
	const capitals = calcCapitals(label.toUpperCase());
	return (
		<AvatarContainer
			ref={ref}
			size={size}
			picture={picture}
			background={color}
		>
			{!picture &&
				<Capitals
					size={size}
				>
					{capitals}
				</Capitals>
			}
		</AvatarContainer>
	);
});

Avatar.propTypes = {
	/** size of the Avatar circle */
	size: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.oneOf(Object.keys(defaultTheme.sizes.avatar))
	]),
	/** url to the profile picture */
	picture: PropTypes.string,
	/** string to be used as capitals, or for its calculation */
	label: PropTypes.string.isRequired,
	/** string to be used for the background color calculation */
	colorLabel: PropTypes.string
};

Avatar.defaultProps = {
	size: 'medium'
};

export default Avatar;
