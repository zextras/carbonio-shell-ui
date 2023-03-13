/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';
import { useLogo } from '../store/login/hooks';
import { useLoginConfigStore } from '../store/login/store';

export const Logo = (props: Record<string, unknown>): JSX.Element => {
	const { loaded } = useLoginConfigStore();
	const LogoElement = useLogo();

	return loaded ? (
		(typeof LogoElement === 'string' && <img alt={''} {...props} src={LogoElement} />) || (
			<LogoElement {...props} />
		)
	) : (
		<></>
	);
};
