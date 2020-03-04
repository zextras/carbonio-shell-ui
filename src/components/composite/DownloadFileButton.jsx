import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '../primitive/Container';
import Text from '../primitive/Text';
import Icon from '../primitive/Icon';
import GenericFileIcon from './GenericFileIcon';


const Comp = styled.button`
		background: ${props => props.theme.colors.background['bg_8']};
		border-radius: 2px;
		border: none;
		width: 100%;
		cursor: pointer;
		outline:none;
		padding: ${props => props.theme.sizes.padding['small']};
`;

const DownloadFileButton = ({ icon, fileName, ...rest }) => {
	return (
		<Comp { ...rest }>
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
};

DownloadFileButton.propTypes = {
	fileName: PropTypes.string.isRequired,
	icon: PropTypes.elementType
};

DownloadFileButton.defaultProps = {
};

export default DownloadFileButton;
