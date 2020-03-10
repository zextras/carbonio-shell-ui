import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Container from './Container';
import { map } from 'lodash';
import Text from "./Text";
import Padding from "./Padding";
import Dropdown from "./Dropdown";
import { useSplitVisibility } from "../../hooks/useSplitVisibility";

const CheckDiv = styled.div`
	width: 100%
`;

function Breadcrumbs({ crumbs }) {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [visibleCrumbs, hiddenCrumbs, containerRef] = useSplitVisibility(crumbs);

	return (
		<CheckDiv ref={containerRef} >
			<Container orientation="horizontal" mainAlignment="flex-start" width="fit">
				{
					hiddenCrumbs.length > 0 &&
					<Padding
						key="ellipsed-bc"
						all="extrasmall"
						onClick={() => setDropdownOpen(!dropdownOpen)}
						style={{ cursor: 'pointer'}}
					>
						<Text
							size="large"
							color="txt_4"
						>
							/&nbsp;&nbsp;&hellip;
						</Text>
						<Dropdown items={hiddenCrumbs} open={dropdownOpen} left="0" top="0"/>
					</Padding>
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
								color={index === (visibleCrumbs.length - 1) ? 'txt_1' : 'txt_4' }
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
	crumbs: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, click: PropTypes.func }))
};

Breadcrumbs.defaultProps = {};

export default Breadcrumbs;
