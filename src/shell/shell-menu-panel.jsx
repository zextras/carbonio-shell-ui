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

/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Container, Responsive } from '@zextras/zapp-ui';
import styled from 'styled-components';

const Spacer = styled.div`
	position: relative;
	width: ${({ mode }) => (mode === 'open' ? 256 : 40)}px;
	height: 100%;
	transition: width 0.2s;
`;
const Panel = styled(Container)`
	width: ${({ mode }) => (mode !== 'closed' ? 256 : 40)}px;
	height: 100%;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	transition: width 0.2s;
`;

export default function ShellMenuPanel({ mode, children }) {
	return (
		<Responsive mode="desktop">
			<Spacer mode={mode}>
				<Panel mode={mode} mainAlignment="flex-start">
					{children}
				</Panel>
			</Spacer>
		</Responsive>
	);
}
