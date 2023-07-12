/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import '../splash.css';
import React from 'react';

import styled from 'styled-components';

import Helmet from '../../assets/carbonio-head.svg';
// TODO: change with import from logo component when ready
import Logo from '../../assets/carbonio.svg';
// import { Logo } from '../shell/logo';

const StyledLogo = styled(Logo)`
	fill: #a3aebc;
	width: 50%;
`;
const LoadingView = (): JSX.Element => (
	<div className="splash">
		<Helmet fill="#A3AEBC" />
		<div className="loader">
			<div className="bar"></div>
		</div>
		<StyledLogo />
	</div>
);
export default LoadingView;
