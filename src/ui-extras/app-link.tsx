/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';

import type { LinkProps } from 'react-router-dom';
import { Link as RRLink } from 'react-router-dom';

import { parseParams } from '../history/hooks';

export type AppLinkProps = LinkProps & {
	route?: string;
};
export const AppLink = ({ to, route, ...rest }: AppLinkProps): React.JSX.Element => {
	const _to = useMemo(() => parseParams({ path: to, route }), [route, to]);
	return <RRLink style={{ textDecoration: 'none' }} to={_to} {...rest} />;
};
