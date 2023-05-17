/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { CSSProperties, useMemo, useRef } from 'react';
import styled, { SimpleInterpolation } from 'styled-components';
import { Container, ContainerProps } from '@zextras/carbonio-design-system';
import { Border, BORDERS, getCursorFromBorder, useResize } from '../hooks/useResize';

interface ResizableBorderProps {
	border: Border;
	elementToResize: React.RefObject<HTMLElement>;
	localStorageKey?: string;
}

interface ResizableContainerProps extends ContainerProps {
	elementToResize: React.RefObject<HTMLElement>;
	localStorageKey?: string;
	disabled?: boolean;
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
	cursor: ${({ $cursor }): CSSProperties['cursor'] => $cursor};
	width: ${({ $width }): string => $width};
	height: ${({ $height }): string => $height};
	${({ $position }): SimpleInterpolation => $position};
	z-index: 2;
`;

const ResizableBorder = ({
	border,
	elementToResize,
	localStorageKey
}: ResizableBorderProps): JSX.Element => {
	const borderRef = useRef<HTMLDivElement>(null);
	const resizeHandler = useResize(elementToResize, border, { localStorageKey });

	const sizes = useMemo<Pick<BorderWithResizeProps, '$width' | '$height'>>(() => {
		switch (border) {
			case 'n':
			case 's':
				return {
					$width: '100%',
					$height: '1px'
				};
			case 'e':
			case 'w':
				return {
					$width: '1px',
					$height: '100%'
				};
			case 'ne':
			case 'nw':
			case 'se':
			case 'sw':
			default:
				return {
					$width: '1px',
					$height: '1px'
				};
		}
	}, [border]);

	const position = useMemo<BorderWithResizeProps['$position']>(() => {
		const _position: BorderWithResizeProps['$position'] = {};
		if (border.includes('n')) {
			_position.top = 0;
		}
		if (border.includes('s')) {
			_position.bottom = 0;
		}
		if (border.includes('e')) {
			_position.right = 0;
		}
		if (border.includes('w')) {
			_position.left = 0;
		}
		return _position;
	}, [border]);

	return (
		<BorderWithResize
			ref={borderRef}
			{...sizes}
			$position={position}
			$cursor={getCursorFromBorder(border)}
			onMouseDown={resizeHandler}
		/>
	);
};

export const ResizableContainer = ({
	elementToResize,
	children,
	localStorageKey,
	disabled = false,
	...rest
}: ResizableContainerProps): JSX.Element => {
	const borders = useMemo(
		() =>
			BORDERS.map((border) => (
				<ResizableBorder
					key={`border-${border}`}
					border={border}
					elementToResize={elementToResize}
					localStorageKey={localStorageKey}
				/>
			)),
		[elementToResize, localStorageKey]
	);

	return (
		<MainContainer {...rest}>
			{!disabled && borders}
			{children}
		</MainContainer>
	);
};
