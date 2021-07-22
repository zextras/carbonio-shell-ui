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

import { find } from 'lodash';
import React, { FC, useMemo, useEffect } from 'react';
import { useApps } from '../app-store/hooks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AppContextProvider from '../app/app-context-provider';
import { useSearchStore } from './search-store';
import { AppData } from '../../types/index';

export const SearchAppView: FC = () => {
	const { query, module, update, addQueryChip } = useSearchStore();
	const apps = useApps();
	useEffect(() => {
		if (!module) {
			update(find(apps, (app: AppData): boolean => !!app.views?.search)?.core.package);
		}
	}, [apps, module, update]);

	const Search = useMemo(
		() => (module && apps[module]?.views?.search ? apps[module]?.views?.search : null),
		[apps, module]
	);

	return module ? (
		<AppContextProvider pkg={module}>
			{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
			{/* @ts-ignore */}
			<Search query={query} addQueryChip={addQueryChip} />
		</AppContextProvider>
	) : null;
};
