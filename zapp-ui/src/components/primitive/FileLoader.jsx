
import React, { useRef } from 'react';
import styled from "styled-components";
import PropTypes from 'prop-types';
import IconButton from "./IconButton";
const FileInput = styled.input`
	display: none;
`;

export default function FileLoader({
	onChange,
	icon,
	iconColor,
	multiple,
	accept,
	backgroundColor,
	size
}) {
	const inputRef = useRef();

	return (
		<>
			<FileInput
				type="file"
				ref={inputRef}
				onChange={(ev) => onChange(ev, inputRef.current.files)}
				multiple={multiple}
				accept={accept}
			/>
			<IconButton
				icon={icon}
				iconColor={iconColor}
				size={size}
				backgroundColor={backgroundColor}
				onClick={() => {
					if (inputRef.current) {
						inputRef.current.value = null;
						inputRef.current.click();
					}
				}}
			/>
		</>
	)
};

FileLoader.propTypes = {
	onChange: PropTypes.func,
	/** Color of the icon */
	iconColor: IconButton.propTypes.iconColor,
	/** Color of the button */
	backgroundColor: IconButton.propTypes.backgroundColor,
	/** button size */
	size: IconButton.propTypes.size,
	/** icon name */
	icon: IconButton.propTypes.icon,
	/** accept multiple files */
	multiple: PropTypes.bool,
	/** capture mode (see <input type="file"> docs) */
	capture: PropTypes.string,
	accept: PropTypes.string
};

FileLoader.defaultProps = {
	icon: 'Attach'
};
