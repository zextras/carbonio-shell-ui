import React, { useRef, useCallback, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconButton from './IconButton';
const FileInput = styled.input`
	display: none;
`;

const FileLoader = React.forwardRef(function({
	icon,
	onChange,
	multiple,
	accept,
	...rest
}, ref) {
	const inputRef = useRef();
	const onClick = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = null;
			inputRef.current.click();
		}
	}, [inputRef]);

	return (
		<Fragment>
			<FileInput
				type="file"
				ref={inputRef}
				onChange={(ev) => onChange(ev, inputRef.current.files)}
				multiple={multiple}
				accept={accept}
			/>
			<IconButton
				ref={ref}
				icon={icon}
				{...rest}
				onClick={onClick}
			/>
		</Fragment>
	)
});

FileLoader.propTypes = {
	onChange: PropTypes.func,
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

export default FileLoader;
