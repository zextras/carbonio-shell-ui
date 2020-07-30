/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useContext } from 'react';
import { Link as _Link } from 'react-router-dom';
import AppContext from './app-context';

const HAS_SEARCH_REG = /\?/;

export default function AppLink({ to, ...rest }) {
	const { pkg } = useContext(AppContext);

	if (typeof to === 'string') {
		let urlTo = '';
		let urlSearch = '';
		if (HAS_SEARCH_REG.test(to)) {
			[urlTo, urlSearch] = to.split('?');
		}
		else {
			urlTo = to;
		}
		return (
			<_Link to={{ pathname: `/${pkg.package}${urlTo}`, search: urlSearch }} {...rest} />
		);
	} else {
		return (
			<_Link to={{ ...to, pathname: `/${pkg.package}${to.pathname}` }} {...rest} />
		);
	}
}
