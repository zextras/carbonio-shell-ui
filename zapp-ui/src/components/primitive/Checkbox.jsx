import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from "./Container";
import Icon from "./Icon";
import Text from "./Text";
import Padding from "./Padding";

const IconWrapper = styled.div`
	&:focus{
		outline: 1px solid #eee;
	}
`;

function Checkbox({
	defaultChecked,
	label,
	onClick,
	onChange
}) {
	const [checked, setChecked] = useState(defaultChecked);
	return (
		<Container
			orientation="horizontal"
			width="fit"
			height="fit"
			padding={{ vertical: 'medium', horizontal: 'large'}}
			style={{ cursor: 'pointer'}}
			onClick={() => {
				setChecked(!checked);
				if (onChange) {
					onChange(!checked);
				}
				if (onClick) {
					onClick();
				}
			}}
			crossAlignment="center"
		>
			<IconWrapper tabIndex={0}>
				<Icon size="large" icon={checked ? 'CheckmarkSquare' : 'Square'} style={{display: 'block'}} />
			</IconWrapper>
		{label && <Padding left="small"><Text size="medium" weight="regular" overflow="break-word" style={{userSelect: 'none'}}>{label}</Text></Padding>}
		</Container>
	);
}

Checkbox.propTypes = {
	/** status of the Checkbox */
	defaultChecked: PropTypes.bool,
	/** Checkbox text */
	label: PropTypes.string,
	/** click callback */
	onClick: PropTypes.func,
	/** change callback */
	onChange: PropTypes.func
};

Checkbox.defaultProps = {
};

export default Checkbox;
