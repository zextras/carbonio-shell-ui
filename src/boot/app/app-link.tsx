/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
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
