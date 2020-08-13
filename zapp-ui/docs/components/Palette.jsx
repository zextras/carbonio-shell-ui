import React, { Fragment } from 'react';
import styled from 'styled-components';
import Container from "../../src/components/layout/Container";
import { map } from 'lodash';
import Text from "../../src/components/basic/Text";
import Padding from "../../src/components/layout/Padding";

const PaletteEl = styled.div`
	width: 150px;
	height: 100px;
	background: ${props => props.color};
	border-radius: 8px;
	box-shadow: 6px 4px 10px 0px rgba(136,136,136,0.5);
`;
const TextFrame = styled.div`
	background: rgba(200, 200, 200, 0.8);
	padding: 4px 8px;
	border-radius: 8px 8px 0 0;

`;
const ScrollFrame = styled.div`
	width: 100%;
	overflow-x: auto;
`;
const Palette = ({palette}) => {
	return (
		<Container width="fill" height="fit" orientation="vertical" crossAlignment="flex-start">
			{
				map(palette, (set, name) => {
					return (
						<Fragment key={name}>
							<Text size="large">{name}</Text>
							<ScrollFrame>
								<Container orientation="horizontal" height="fit" width="fit" padding={{ all: 'extrasmall', bottom: 'large' }} mainAlignment="flex-start">
								{
									map(set, (color, colorName) => {
										return (
											<Padding horizontal='extrasmall' key={colorName}>
												<PaletteEl name={name} color={color}>
													<TextFrame>
														<Text size="large">{`${colorName}: ${color}`}</Text>
													</TextFrame>
												</PaletteEl>
											</Padding>
										);
									})
								}
								</Container>
							</ScrollFrame>
						</Fragment>
					)
				})
			}
		</Container>
	)
};

export default Palette;
