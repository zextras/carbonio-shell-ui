/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';

import { Link as RRLink, LinkProps } from 'react-router-dom';

import { parseParams } from '../history/hooks';

type AppLinkProps = LinkProps & {
	route?: string;
};
export const AppLink: FC<AppLinkProps> = ({ to, route, ...rest }) => {
	const _to = useMemo(() => parseParams({ path: to, route }), [route, to]);
	return <RRLink style={{ textDecoration: 'none' }} to={_to} {...rest} />;
};
