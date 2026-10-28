/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { FunctionComponent, MouseEventHandler } from 'react';

import styled from '@emotion/styled';

/**
 * Divider on the right edge of the secondary bar, styled as the Mails divider between list and
 * reading pane: 1px gray at rest, 2px primary on hover and while dragging.
 * It takes 1px in the layout, the highlight and the grab area are drawn on top of it.
 */
const Divider = styled.div<{ $active: boolean }>`
	position: relative;
	flex: 0 0 auto;
	height: 100%;
	width: 0.0625rem;
	background-color: ${({ theme }): string => theme.palette.gray2.regular};
	cursor: ew-resize;

	/* invisible area, wider than the divider, to make it easier to grab */
	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: -0.25rem;
		width: 0.5rem;
		z-index: 1;
	}

	/* highlight */
	&::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 0.125rem;
		z-index: 1;
		background-color: ${({ theme }): string => theme.palette.primary.regular};
		opacity: ${({ $active }): number => ($active ? 1 : 0)};
		transition: opacity 0.2s ease-out;
		pointer-events: none;
	}

	&:hover::after {
		opacity: 1;
	}
`;

type SecondaryBarDividerProps = {
	/** Mouse down handler which starts the resize */
	onResizeStart: MouseEventHandler;
	/** Whether the user is dragging the divider */
	isResizing: boolean;
};

export const SecondaryBarDivider: FunctionComponent<SecondaryBarDividerProps> = ({
	onResizeStart,
	isResizing
}) => (
	<Divider
		role="separator"
		aria-orientation="vertical"
		$active={isResizing}
		onMouseDown={onResizeStart}
	/>
);
