/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import './splash.css';
import React from 'react';

export const LoadingView = (): React.JSX.Element => (
	<div className="splash">
		<div className="loader">
			<div className="bar"></div>
		</div>
	</div>
);
