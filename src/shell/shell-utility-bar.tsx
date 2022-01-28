/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useMemo } from 'react';
import { Container, Tooltip, IconButton, Responsive } from '@zextras/carbonio-design-system';
import { find, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAppStore } from '../store/app/store';
import AppContextProvider from '../boot/app/app-context-provider';

/* eslint-disable react/no-array-index-key */

const Spacer = styled.div<{ mode: string }>`
	position: relative;
	width: ${({ mode }): number => (mode === 'open' ? 256 : 40)}px;
	height: 100%;
	transition: width 0.2s;
`;
const Panel = styled(Container)`
	width: ${({ mode }): number => (mode !== 'closed' ? 256 : 40)}px;
	border-radius: 0;
	height: 100%;
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	transition: width 0.2s;
`;

export const ShellUtilityBar: FC<{
	mode: 'closed' | 'overlap' | 'open';
	setMode: (m: 'closed' | 'overlap' | 'open') => void;
	current?: string;
	setCurrent: (c: string) => void;
}> = ({ mode, setMode, current, setCurrent }) => {
	const history = useHistory();
	const utilityViews = useAppStore((s) => s.views.utilityBar);

	return (
		<Container>
			{map(utilityViews, (view) => {
				if (typeof view.button === 'string') {
					return (
						<Tooltip label={view.label} placement="right" key={view.id}>
							<IconButton
								icon={view.button}
								backgroundColor="gray6"
								iconColor="text"
								onClick={(): void => {
									setMode('open');
									setCurrent(view.id);
								}}
								size="large"
							/>
						</Tooltip>
					);
				}
				return <view.button />;
			})}
		</Container>
	);
};

export const ShellUtilityPanel: FC<{
	mode: 'closed' | 'overlap' | 'open';
	setMode: (m: 'closed' | 'overlap' | 'open') => void;
	current?: string;
}> = ({ mode, setMode, current }) => {
	const utilityViews = useAppStore((s) => s.views.utilityBar);

	const currentPanel = useMemo(
		() => find(utilityViews, (view) => view.id === current),
		[current, utilityViews]
	);
	return (
		<Responsive mode="desktop">
			<Spacer mode={mode}>
				<Panel mode={mode} mainAlignment="flex-start">
					{current && currentPanel && (
						<AppContextProvider pkg={currentPanel?.id}>
							<currentPanel.component mode={mode} setMode={setMode} />
						</AppContextProvider>
					)}
				</Panel>
			</Spacer>
		</Responsive>
	);
};
