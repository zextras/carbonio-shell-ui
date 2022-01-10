/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { Link as RRLink, LinkProps } from 'react-router-dom';

export const getAppLink = (pkg: string): FC<LinkProps> => {
	const AppLink: FC<LinkProps> = ({ to, ...rest }) => {
		const _to = useMemo(() => {
			if (typeof to === 'string') {
				const [urlTo, urlSearch] = to.split('?');
				return { pathname: `/${pkg}${urlTo}`, search: urlSearch };
			}
			// TODO: check why ts is not happy with to.pathname
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return { ...to, pathname: `/${pkg}${to.pathname}` };
		}, [to]);
		return <RRLink style={{ textDecoration: 'none' }} to={_to} {...rest} />;
	};
	return AppLink;
};
