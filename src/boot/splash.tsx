/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import '../splash.css';
import React, { FC } from 'react';
import Logo from '../svg/carbonio-beta.svg';
import LogoAdmin from '../svg/carbonio-admin-panel.svg';
import Helmet from '../svg/carbonio-head.svg';

const LoadingView: FC = () => (
	<div className="splash">
		<Helmet fill="#A3AEBC" />
		<div className="loader">
			<div className="bar"></div>
		</div>
		{__SHELL_ENV__ === 'carbonioAdmin' ? (
			<LogoAdmin fill="#A3AEBC" width="50%" />
		) : (
			<Logo fill="#A3AEBC" width="50%" />
		)}
	</div>
);
export default LoadingView;
