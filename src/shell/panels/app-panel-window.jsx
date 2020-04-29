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
import styled from 'styled-components';
import { reduce } from 'lodash';
import ShellContext from '../shell-context';
import AppPanelTab from './app-panel-tab';
import AppPanel from './app-panel';

const _container = styled.div`
	position: fixed;
	bottom: 0;
	left: 0;
	width: 60vw;
	height: 60vh;
`;
const _tabs = styled.div``;

export default function AppPanelWindow() {
	const { panels: shellPanels } = useContext(ShellContext);
	const [tabs, panels] = reduce(
		shellPanels,
		(r, v, k) => {
			const [t, p] = r;
			t.push((
				<AppPanelTab key={v + k} idx={k} />
			));
			p.push((
				<AppPanel key={v + k} idx={k} />
			));
			return r;
		},
		[[], []]
	);

	if (tabs.length > 0)
		return (
			<_container>
				<_tabs>
					{tabs}
				</_tabs>
				{panels}
			</_container>
		);
	return null;
}
