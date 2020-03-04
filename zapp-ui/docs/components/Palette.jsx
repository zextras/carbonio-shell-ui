import React from 'react';
import styled from 'styled-components';
import Container from "../../src/components/primitive/Container";
import { map } from 'lodash';
import Text from "../../src/components/primitive/Text";

const PaletteEl = styled.div`
	width: 128px;
	height: 128px;
	background: ${props => props.color};
	border: 1px solid white;
`;
const TextFrame = styled.div`
	background: rgba(200, 200, 200, 0.5);
	padding: 4px 8px;
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
						<>
							<Text size="large">{name}</Text>
							<ScrollFrame>
								<Container orientation="horizontal" height="fit" width="fit" padding={{ all: 'extrasmall' }} mainAlignment="flex-start">
								{
									map(set, (color, colorName) => {
										return (
											<PaletteEl name={name} color={color}>
												<TextFrame>
													<Text size="large">{`${colorName}: ${color}`}</Text>
												</TextFrame>
											</PaletteEl>
										);
									})
								}
								</Container>
							</ScrollFrame>
						</>
					)
				})
			}
		</Container>
	)
};

export default Palette;
