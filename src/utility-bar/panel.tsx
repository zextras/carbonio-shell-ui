/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { FC } from 'react';
import React, { useEffect, useMemo } from 'react';

import { Container, Responsive } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import styled from 'styled-components';

import { useUtilityBarStore } from './store';
import { useUtilityViews } from './utils';
import AppContextProvider from '../boot/app/app-context-provider';

const Panel = styled(Container)<{ mode: string }>`
	width: ${({ mode }): number => (mode !== 'closed' ? 16 : 3)}rem;
	border-radius: 0;
	height: 100%;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	transition: width 0.2s;
	border-left: 0.0625rem solid ${({ theme }): string => theme.palette.gray2.regular};
`;
const Spacer = styled.div<{ mode: string }>`
	position: relative;
	width: ${({ mode }): number => (mode === 'open' ? 16 : 3)}rem;
	height: 100%;
	transition: width 0.2s;
`;

export const ShellUtilityPanel: FC = () => {
	const { mode, setMode, current, setCurrent } = useUtilityBarStore();
	const views = useUtilityViews();
	const currentPanel = useMemo(() => find(views, (view) => view.id === current), [current, views]);
	useEffect(() => {
		if (!(current && currentPanel)) {
			setCurrent(views[0]?.id);
		}
	}, [current, currentPanel, setCurrent, views]);
	return currentPanel ? (
		<Responsive mode="desktop">
			<Spacer mode={mode}>
				<Panel mode={mode} mainAlignment="flex-start">
					{currentPanel && (
						<AppContextProvider pkg={currentPanel?.id}>
							<currentPanel.component mode={mode} setMode={setMode} />
						</AppContextProvider>
					)}
				</Panel>
			</Spacer>
		</Responsive>
	) : null;
};
