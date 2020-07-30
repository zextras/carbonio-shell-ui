import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import Container from '../layout/Container';
import Text from '../basic/Text';
import Padding from '../layout/Padding';
import Dropdown from '../display/Dropdown';
import { useSplitVisibility } from '../../hooks/useSplitVisibility';

const CheckDiv = styled.div`
	width: 100%
`;

function Breadcrumbs({ crumbs }) {
	const [visibleCrumbs, hiddenCrumbs, containerRef] = useSplitVisibility(crumbs, 'start');

	return (
		<CheckDiv ref={containerRef} >
			<Container orientation="horizontal" mainAlignment="flex-start" width="fit">
				{
					hiddenCrumbs.length > 0 &&
					<Dropdown
						items={hiddenCrumbs}
					>
						<Padding
							key="ellipsed-bc"
							all="extrasmall"
							style={{ cursor: 'pointer'}}
						>
							<Text
								size="large"
								color="secondary"
							>
								/&nbsp;&nbsp;&hellip;
							</Text>
						</Padding>
					</Dropdown>
				}
				{
					map(visibleCrumbs, (crumb, index) => (
						<Padding
							key={`${index}-${crumb.label}`}
							all="extrasmall"
							onClick={crumb.click}
							style={{ cursor: 'pointer'}}
						>
							<Text
								size="large"
								color={index === (visibleCrumbs.length - 1) ? 'text' : 'secondary' }
							>
								/&nbsp;&nbsp;{crumb.label}
							</Text>
						</Padding>
					))
				}
			</Container>
		</CheckDiv>
	);
}

Breadcrumbs.propTypes = {
	crumbs: Dropdown.propTypes.items
};

Breadcrumbs.defaultProps = {};

export default Breadcrumbs;
