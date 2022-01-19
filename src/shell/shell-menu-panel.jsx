/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Container, Responsive } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

const Spacer = styled.div`
	position: relative;
	width: ${({ mode }) => (mode === 'open' ? 256 : 40)}px;
	height: 100%;
	transition: width 0.2s;
`;
const Panel = styled(Container)`
	width: ${({ mode }) => (mode !== 'closed' ? 256 : 40)}px;
	border-radius: 0;
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
