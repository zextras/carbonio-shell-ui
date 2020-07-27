import React, { useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

import Text from '../basic/Text';
import useKeyboard, { getKeyboardPreset } from '../../hooks/useKeyboard';
import { useCombinedRefs } from '../../hooks/useCombinedRefs';

const _Link = styled(Text)`
	cursor: pointer;
	text-decoration: ${({ underlined }) => !underlined ? 'none' : 'underline'};
	
	${({ size }) => typeof size === 'undefined' && css`
		font-size: 1em;
	`}
	
	&:hover,
	&:focus{
		color: ${({ color, theme }) => theme.palette[color].hover};
		outline: none;
		text-decoration: underline;
	}
`;

const Link = React.forwardRef(function ({
	as = 'a',
	children,
	size,
	underlined,
	...rest
}, ref) {
	const linkRef = useRef(undefined);
	const combinedRef = useCombinedRefs(ref, linkRef);

	const keyPress = useCallback(() => combinedRef.current.click(), [combinedRef]);
	const keyEvents = useMemo(() => getKeyboardPreset('button', keyPress), [keyPress]);
	useKeyboard(combinedRef, keyEvents);

	return (
		<_Link
			ref={combinedRef}
			tabIndex={0}
			forwardedAs={as}
			size={size}
			underlined={underlined ? 1 : 0}
			{...rest}
		>
			{ children }
		</_Link>
	);
});

Link.propTypes = {
	/** Whether or not the link should be underlined */
	underlined: PropTypes.bool,
};

Link.defaultProps = {
	underlined: false,
	color: 'primary'
};

export default Link;