import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from './Icon';
import defaultTheme from '../../theme/Theme';

const AvatarContainer = styled.div`
	width: ${({ theme, size }) => theme.sizes.avatar[size].diameter};
	min-width: ${({ theme, size }) => theme.sizes.avatar[size].diameter};
	height: ${({ theme, size }) => theme.sizes.avatar[size].diameter};
	min-height: ${({ theme, size }) => theme.sizes.avatar[size].diameter};
	background: ${({ theme, background }) => theme.avatarColors[background]} url(${({ picture }) => picture}) no-repeat;
	background-size: contain;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Capitals = styled.p`
	font-size: ${({ theme, size }) => theme.sizes.avatar[size].font};
	color: ${({ theme }) => theme.palette.gray6.regular};
	font-family: ${({ theme }) => theme.fonts['default']};
	font-weight: ${({ theme }) => theme.fonts.weight['regular']};
	user-select: none;
`;

const AvatarIcon = styled(Icon)`
	width: calc(${({ theme, size }) => theme.sizes.avatar[size].diameter} - 25%);
	min-width: calc(${({ theme, size }) => theme.sizes.avatar[size].diameter} - 25%);
	height: calc(${({ theme, size }) => theme.sizes.avatar[size].diameter} - 25%);
	min-height: calc(${({ theme, size }) => theme.sizes.avatar[size].diameter} - 25%);
`;

const _SPECIAL_CHARS_REGEX = /[&/\\#,+()$~%.'":*?!<>{}@^_`=]/g;
const _WHITESPACE_REGEX = /[ ]/g;
const _WHITESPACE_REGEX_2 = / /;

function calcCapitals(label) {
	const noSpecString = label.replace(_SPECIAL_CHARS_REGEX, '');
	if (noSpecString.replace(_WHITESPACE_REGEX, '').length !== 0) {
		label = noSpecString;
	}
	else { return null }

	if (label.replace(_WHITESPACE_REGEX, '').length === 0) {
		return null;
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

const Avatar = React.forwardRef(function({size, label, colorLabel, picture, icon, fallbackIcon}, ref) {
	const color = useMemo(() => calcColor(colorLabel || label), [colorLabel, label]);
	const capitals = useMemo(() => calcCapitals(label.toUpperCase()), [label]);
	const symbol = useMemo(() => {
		if (typeof icon !== 'undefined') {
			return (
				<AvatarIcon
					size={size}
					icon={icon}
					color="gray6"
				/>
			);
		}
		if (capitals !== null) {
			return (
				<Capitals
					size={size}
				>
					{capitals}
				</Capitals>
			)
		}
		return (
			<AvatarIcon
				size={size}
				icon={fallbackIcon}
				color="gray6"
			/>
		);
	}, [capitals, icon, fallbackIcon, size]);
	return (
		<AvatarContainer
			ref={ref}
			size={size}
			picture={picture}
			background={color}
		>
			{!picture && symbol}
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
	colorLabel: PropTypes.string,
	/** icon to display instead of the capitals */
	icon: PropTypes.string,
	/** icon to display as capitals fallback */
	fallbackIcon: PropTypes.string,
};

Avatar.defaultProps = {
	size: 'medium',
	fallbackIcon: 'QuestionMark'
};

export default Avatar;
