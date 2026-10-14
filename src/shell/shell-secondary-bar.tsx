/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';

import styled from '@emotion/styled';
import { Container } from '@zextras/carbonio-design-system';
import { filter, findIndex, map, sortBy } from 'lodash';
import { Route, Routes } from 'react-router-dom';

import { useHorizontalResize } from './hooks/useHorizontalResize';
import {
	isSecondaryBarCollapsed,
	snapSecondaryBarWidth,
	useSecondaryBarWidth
} from './hooks/useSecondaryBarWidth';
import { SecondaryBarDivider } from './secondary-bar-divider';
import { AppContextProvider } from '../boot/app/app-context-provider';
import { SECONDARY_BAR_WIDTH } from '../constants/internal-constants';
import { useCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';
import type { AppRoute } from '../types/apps';
import { useUtilityBarStore } from '../utility-bar/store';
import { checkRoute } from '../utility-bar/utils';

const SidebarContainer = styled(Container)<{ $width: number }>`
	min-width: ${SECONDARY_BAR_WIDTH.collapsed}rem;
	max-width: ${SECONDARY_BAR_WIDTH.max}rem;
	width: ${({ $width }): number => $width}rem;
	transition: width 300ms;
	overflow-x: hidden;
`;

const FALLBACK_ROOT_FONT_SIZE = 16;

/**
 * Return the root font size in px, which is the value of 1rem
 */
function getRootFontSize(): number {
	const { fontSize } = getComputedStyle(document.documentElement);
	const value = parseFloat(fontSize);
	return fontSize.endsWith('px') && value > 0 ? value : FALLBACK_ROOT_FONT_SIZE;
}

/**
 * Return the width (in px) the secondary bar takes while dragging, for the given pointer width (in px)
 */
function clampSecondaryBarWidth(width: number): number {
	const rootFontSize = getRootFontSize();
	return snapSecondaryBarWidth(width / rootFontSize) * rootFontSize;
}

const ShellSecondaryBarComponent = ({
	activeRoute
}: {
	activeRoute?: AppRoute;
}): React.ReactNode => {
	// false while the utility panel is open: the bar is temporarily collapsed, without changing the saved width
	const isNotForcedCollapsed = useUtilityBarStore((s) => s.secondaryBarState);
	const setIsNotForcedCollapsed = useUtilityBarStore((s) => s.setSecondaryBarState);
	const secondaryBarViews = useAppStore((s) => s.views.secondaryBar);
	const secondaryBarAccessoryViews = useAppStore((s) => s.views.secondaryBarAccessories);
	const accessories = useMemo(
		() =>
			sortBy(
				filter(secondaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, secondaryBarAccessoryViews]
	);
	const disabled = useMemo(
		() => findIndex(secondaryBarViews, (view) => view.id === activeRoute?.id) < 0,
		[activeRoute?.id, secondaryBarViews]
	);

	const sidebarRef = useRef<HTMLDivElement>(null);
	const [savedWidth, saveWidth] = useSecondaryBarWidth();
	// collapsed state of the width under the pointer, used while dragging to switch the UI as soon as
	// the collapse threshold is crossed. Being a boolean, it causes a render only when the threshold is crossed
	const [isCollapsedWhileResizing, setIsCollapsedWhileResizing] = useState(false);
	const onResize = useCallback((width: number) => {
		// the clamped width is either the icons-only width or at least the min width, so the threshold splits them
		setIsCollapsedWhileResizing(width / getRootFontSize() < SECONDARY_BAR_WIDTH.collapseThreshold);
	}, []);
	const onResizeEnd = useCallback(
		(width: number) => {
			saveWidth(width / getRootFontSize());
			// a drag made by the user wins over the temporary collapse
			setIsNotForcedCollapsed(true);
		},
		[saveWidth, setIsNotForcedCollapsed]
	);
	const { onResizeStart, isResizing } = useHorizontalResize({
		elementRef: sidebarRef,
		clampWidth: clampSecondaryBarWidth,
		onResize,
		onResizeEnd
	});

	const width = isNotForcedCollapsed ? savedWidth : SECONDARY_BAR_WIDTH.collapsed;
	const expanded = isResizing ? !isCollapsedWhileResizing : !isSecondaryBarCollapsed(width);

	return disabled ? null : (
		<>
			<SidebarContainer
				ref={sidebarRef}
				data-testid="SideSecondaryBarContainer"
				$width={width}
				role="menu"
				height="fill"
				orientation="vertical"
				mainAlignment="space-between"
				style={{
					maxHeight: 'calc(100vh - 3.75rem)',
					overflowY: 'auto'
				}}
			>
				<Container mainAlignment="flex-start">
					<Routes>
						{map(secondaryBarViews, (view) => (
							<Route
								key={view.id}
								path={`${view.route}/*`}
								element={
									<AppContextProvider pkg={view.app}>
										<view.component expanded={expanded} />
									</AppContextProvider>
								}
							/>
						))}
					</Routes>
				</Container>
				<Container mainAlignment="flex-end" height="fit">
					{accessories.map((view) => (
						<AppContextProvider key={view.id} pkg={view.app}>
							<view.component expanded={expanded} />
						</AppContextProvider>
					))}
				</Container>
			</SidebarContainer>
			<SecondaryBarDivider onResizeStart={onResizeStart} isResizing={isResizing} />
		</>
	);
};

const MemoShellSecondaryBar = React.memo(ShellSecondaryBarComponent);

const ShellSecondaryBar = (): React.JSX.Element => {
	const activeRoute = useCurrentRoute();
	return <MemoShellSecondaryBar activeRoute={activeRoute} />;
};

export default ShellSecondaryBar;
