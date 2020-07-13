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
import { Container, Divider, IconButton, Row, Padding } from '@zextras/zapp-ui';
import ShellContext from '../shell-context';
import AppPanelTab from './app-panel-tab';
import AppPanel from './app-panel';

const BoardContainer = styled(Container)`
	position: fixed;
	bottom: 0;
	left: 75px;
	width: 700px;
	height: 60vh;
	min-height: 400px;	
	box-shadow: 0 2px 5px 0 rgba(125,125,125,0.5);
`;
const Header = styled(Row)``;
const PanelsContainer = styled(Row)`
	min-height: 0;
`;
const BackButton = styled(IconButton)``;
const TabsContainer = styled(Row)``;
const Actions = styled(Row)``;

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

	if (!tabs.length) return null;
	return (
		<BoardContainer
			background="gray6"
			crossAlignment="unset"
		>
			<Header background="gray5">
				<Padding all="extrasmall"><BackButton icon="ChevronLeftOutline" /></Padding>
				<TabsContainer height="100%" mainAlignment="flex-start" takeAvailableSpace={true}>
					{ tabs }
				</TabsContainer>
				<Actions padding={{ all: 'extrasmall' }}>
					<Padding right="extrasmall"><IconButton icon="ExpandOutline" /></Padding>
					<IconButton icon="CloseOutline" />
				</Actions>
			</Header>
			<Divider style={{ height: '2px' }}/>
			<PanelsContainer takeAvailableSpace={true}>
				{ panels }
			</PanelsContainer>
		</BoardContainer>
	);
}
