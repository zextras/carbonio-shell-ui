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
import React, { useEffect, useState } from 'react';
import { reduce } from 'lodash';
import { useAppsCache } from '../app/app-loader-context-provider';
import { useAddPanelCallback, useBehaviorSubject } from './hooks';
import AppContextProvider from '../app/app-context-provider';

function NewButtonAppOption({ label, path }) {
	const onClick = useAddPanelCallback(path);
	return (
		<button onClick={onClick}>{label}</button>
	);
}

function NewButtonAppOptions({ app }) {
	const createOptions = useBehaviorSubject(app.createOptions);

	const children = reduce(
		createOptions,
		(r, v, k) => {
			if (v.panel) {
				r.push(
					<AppContextProvider key={v.id} pkg={app.pkg}>
						<NewButtonAppOption label={v.label} path={v.panel.path} />
					</AppContextProvider>
				);
			}
			if (v.onClick) {
				r.push(
					<button key={v.id} onClick={v.onClick}>{v.label}</button>
				);
			}
			return r;
		},
		[]
	);

	return (
		<>
			{ children }
		</>
	);
}

export function NewButton() {
	const [appsCache, appsLoaded] = useAppsCache();

	const [children, setChildren] = useState([]);

	useEffect(() => {
		const childrn = reduce(
			appsCache,
			(r, v, k) => {
				r.push((
					<NewButtonAppOptions key={k} app={v} />
				));
				return r;
			},
			[]
		);
		setChildren(childrn);
	}, [appsCache, appsLoaded, setChildren]);

	return (
		<div>
			{ children }
		</div>
	);
}
