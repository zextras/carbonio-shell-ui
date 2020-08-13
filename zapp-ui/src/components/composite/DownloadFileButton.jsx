import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '../layout/Container';
import Text from '../basic/Text';
import Icon from '../basic/Icon';
import GenericFileIcon from './GenericFileIcon';


const Comp = styled.button`
		background: ${({theme}) => theme.palette.gray3.regular};
		border-radius: 2px;
		border: none;
		width: 100%;
		cursor: pointer;
		outline:none;
		padding: ${props => props.theme.sizes.padding['small']};
`;

const DownloadFileButton = React.forwardRef(function({ icon, fileName, ...rest }, ref) {
	return (
		<Comp ref={ref} { ...rest }>
			<Container orientation="horizontal">
				{ icon
					? <Icon icon={icon} size="large" />
					: <GenericFileIcon fileName={fileName} />
				}
				<Container
					padding={{horizontal: 'small'}}
					orientation="horizontal"
					width="fill"
					mainAlignment="flex-start"
				>
					<Text size="medium">
						{ fileName }
					</Text>
				</Container>
				<Icon
					size="medium"
					icon="DownloadOutline"
				/>
			</Container>
		</Comp>
	);
});

DownloadFileButton.propTypes = {
	fileName: PropTypes.string.isRequired,
	icon: PropTypes.elementType
};

DownloadFileButton.defaultProps = {
};

export default DownloadFileButton;
