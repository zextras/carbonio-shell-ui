/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CSSProperties } from 'react';
import React, { useMemo, useRef } from 'react';

import type { ContainerProps } from '@zextras/carbonio-design-system';
import { Container } from '@zextras/carbonio-design-system';
import type { SimpleInterpolation } from 'styled-components';
import styled, { css } from 'styled-components';

import type { Border } from '../hooks/useResize';
import { BORDERS, getCursorFromBorder, useResize } from '../hooks/useResize';

interface ResizableBorderProps {
	border: Border;
	elementToResize: React.RefObject<HTMLElement>;
	localStorageKey?: string;
	keepSyncedWithStorage?: boolean;
}

interface ResizableContainerProps extends ContainerProps {
	elementToResize: React.RefObject<HTMLElement>;
	localStorageKey?: string;
	keepSyncedWithStorage?: boolean;
	disabled?: boolean;
	minSize?: { width: number; height: number };
}

interface BorderWithResizeProps {
	$cursor: CSSProperties['cursor'];
	$width: string;
	$height: string;
	$position: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};
	$translateTransform?: { x?: string; y?: string };
}

const MainContainer = styled(Container)`
	position: relative;
	width: 100%;
	height: 100%;
`;

const BorderWithResize = styled.div<
	BorderWithResizeProps & {
		height?: never;
		width?: never;
	}
>`
	position: absolute;
	z-index: 2;
	cursor: ${({ $cursor }): CSSProperties['cursor'] => $cursor};
	width: ${({ $width }): string => $width};
	height: ${({ $height }): string => $height};
	${({ $position }): SimpleInterpolation => $position};
	${({ $translateTransform }): SimpleInterpolation =>
		($translateTransform?.x || $translateTransform?.y) &&
		css`
			transform: translate(${$translateTransform?.x ?? 0}, ${$translateTransform?.y ?? 0});
		`}
`;

const ResizableBorder = ({
	border,
	elementToResize,
	localStorageKey,
	keepSyncedWithStorage
}: ResizableBorderProps): React.JSX.Element => {
	const borderRef = useRef<HTMLDivElement>(null);
	const resizeHandler = useResize(elementToResize, border, {
		localStorageKey,
		keepSyncedWithStorage
	});

	const sizes = useMemo<Pick<BorderWithResizeProps, '$width' | '$height'>>(() => {
		switch (border) {
			case 'n':
			case 's':
				return {
					$width: '100%',
					$height: '0.25rem'
				};
			case 'e':
			case 'w':
				return {
					$width: '0.25rem',
					$height: '100%'
				};
			case 'ne':
			case 'nw':
			case 'se':
			case 'sw':
			default:
				return {
					$width: '0.25rem',
					$height: '0.25rem'
				};
		}
	}, [border]);

	const positions = useMemo<
		Pick<BorderWithResizeProps, '$position' | '$translateTransform'>
	>(() => {
		const $position: BorderWithResizeProps['$position'] = {};
		const $translateTransform: BorderWithResizeProps['$translateTransform'] = {};
		if (border.includes('n')) {
			$position.top = 0;
			$translateTransform.y = '-50%';
		}
		if (border.includes('s')) {
			$position.bottom = 0;
			$translateTransform.y = '50%';
		}
		if (border.includes('e')) {
			$position.right = 0;
			$translateTransform.x = '50%';
		}
		if (border.includes('w')) {
			$position.left = 0;
			$translateTransform.x = '-50%';
		}
		return { $position, $translateTransform };
	}, [border]);

	return (
		<BorderWithResize
			ref={borderRef}
			{...sizes}
			{...positions}
			$cursor={getCursorFromBorder(border)}
			onMouseDown={resizeHandler}
			data-testid={`resizable-border-${border}`}
		/>
	);
};

export const ResizableContainer = ({
	elementToResize,
	children,
	localStorageKey,
	disabled = false,
	keepSyncedWithStorage,
	...rest
}: ResizableContainerProps): React.JSX.Element => {
	const borders = useMemo(
		() =>
			BORDERS.map((border) => (
				<ResizableBorder
					key={`resizable-border-${border}`}
					border={border}
					elementToResize={elementToResize}
					localStorageKey={localStorageKey}
					keepSyncedWithStorage={keepSyncedWithStorage}
				/>
			)),
		[elementToResize, keepSyncedWithStorage, localStorageKey]
	);

	return (
		<MainContainer {...rest}>
			{!disabled && borders}
			{children}
		</MainContainer>
	);
};
