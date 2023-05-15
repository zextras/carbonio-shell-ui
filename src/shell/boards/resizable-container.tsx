/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { CSSProperties, useRef } from 'react';
import styled, { SimpleInterpolation } from 'styled-components';
import { Container, ContainerProps } from '@zextras/carbonio-design-system';
import { useResize } from '../hooks/useResize';

const MainContainer = styled(Container)`
	position: relative;
	width: 100%;
	height: 100%;
`;

const ResizeContainer = styled.div<{
	$cursor: CSSProperties['cursor'];
	$width: string;
	$height: string;
	$position: {
		top?: number;
		bottom?: number;
		left?: number;
		right?: number;
	};
	height?: never;
	width?: never;
}>`
	position: absolute;
	cursor: ${({ $cursor }): CSSProperties['cursor'] => $cursor};
	width: ${({ $width }): string => $width};
	height: ${({ $height }): string => $height};
	${({ $position }): SimpleInterpolation => $position};
	z-index: 2;
`;

interface ResizableContainerProps extends ContainerProps {
	elementToResize: React.RefObject<HTMLElement>;
}

export const ResizableContainer = ({
	elementToResize,
	children,
	...rest
}: ResizableContainerProps): JSX.Element => {
	const mainContainerRef = useRef<HTMLDivElement>(null);
	const verticalTopRef = useRef<HTMLDivElement>(null);
	const verticalBottomRef = useRef<HTMLDivElement>(null);
	const horizontalLeftRef = useRef<HTMLDivElement>(null);
	const horizontalRightRef = useRef<HTMLDivElement>(null);
	const diagonalTopRightRef = useRef<HTMLDivElement>(null);
	const diagonalBottomRightRef = useRef<HTMLDivElement>(null);
	const diagonalBottomLeftRef = useRef<HTMLDivElement>(null);
	const diagonalTopLeftRef = useRef<HTMLDivElement>(null);

	const resizeVerticalTopHandler = useResize(elementToResize, 'n');
	const resizeVerticalBottomHandler = useResize(elementToResize, 's');
	const resizeHorizontalRightHandler = useResize(elementToResize, 'e');
	const resizeHorizontalLeftHandler = useResize(elementToResize, 'w');
	const resizeDiagonalTopRight = useResize(elementToResize, 'ne');
	const resizeDiagonalBottomRight = useResize(elementToResize, 'se');
	const resizeDiagonalBottomLeft = useResize(elementToResize, 'sw');
	const resizeDiagonalTopLeft = useResize(elementToResize, 'nw');

	return (
		<MainContainer {...rest} ref={mainContainerRef}>
			<ResizeContainer
				ref={verticalTopRef}
				$cursor={'ns-resize'}
				$position={{ top: 0 }}
				$width={'100%'}
				$height={'1px'}
				onMouseDown={resizeVerticalTopHandler}
			/>
			<ResizeContainer
				ref={verticalBottomRef}
				$cursor={'ns-resize'}
				$position={{ bottom: 0 }}
				$width={'100%'}
				$height={'1px'}
				onMouseDown={resizeVerticalBottomHandler}
			/>
			<ResizeContainer
				ref={horizontalLeftRef}
				$cursor={'ew-resize'}
				$position={{ left: 0 }}
				$width={'1px'}
				$height={'100%'}
				onMouseDown={resizeHorizontalLeftHandler}
			/>
			<ResizeContainer
				ref={horizontalRightRef}
				$cursor={'ew-resize'}
				$position={{ right: 0 }}
				$width={'1px'}
				$height={'100%'}
				onMouseDown={resizeHorizontalRightHandler}
			/>
			<ResizeContainer
				ref={diagonalTopRightRef}
				$cursor={'nesw-resize'}
				$position={{ top: 0, right: 0 }}
				$width={'1px'}
				$height={'1px'}
				onMouseDown={resizeDiagonalTopRight}
			/>
			<ResizeContainer
				ref={diagonalBottomRightRef}
				$cursor={'nwse-resize'}
				$position={{ bottom: 0, right: 0 }}
				$width={'1px'}
				$height={'1px'}
				onMouseDown={resizeDiagonalBottomRight}
			/>
			<ResizeContainer
				ref={diagonalBottomLeftRef}
				$cursor={'nesw-resize'}
				$position={{ bottom: 0, left: 0 }}
				$width={'1px'}
				$height={'1px'}
				onMouseDown={resizeDiagonalBottomLeft}
			/>
			<ResizeContainer
				ref={diagonalTopLeftRef}
				$cursor={'nwse-resize'}
				$position={{ top: 0, left: 0 }}
				$width={'1px'}
				$height={'1px'}
				onMouseDown={resizeDiagonalTopLeft}
			/>
			{children}
		</MainContainer>
	);
};
