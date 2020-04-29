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

import React from 'react';
import { reduce } from 'lodash';
import AppContextProvider from './app-context-provider';
import AppLink from './app-link';

export default function AppMainMenuItemChild({ pkg, data }) {
	const children = [];
	if (data.children) {
		reduce(
			data.children,
			(r, v, k) => {
				r.push((
					<AppMainMenuItemChild key={v.id} pkg={pkg} data={v} />
				));
				return r;
			},
			children
		);
	}
	return (
		<li>
			<AppContextProvider pkg={pkg}>
				{data.icon && data.icon} <AppLink to={data.to}>{ data.label }</AppLink>
			</AppContextProvider>
			{ children.length > 0 && <ul>
				{ children }
			</ul> }
		</li>
	);
}
