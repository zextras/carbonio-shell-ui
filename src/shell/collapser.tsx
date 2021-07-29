import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Icon } from '@zextras/zapp-ui';

const VerticalDivider = styled.div`
	position: relative;
	overflow: visible;
	height: 100%;
	width: 1px;
	max-width: 1px;
	min-width: 1px;
	background-color: ${({ theme }): string => theme.palette.gray2.regular};
	transition: background 0.2s;
	&:hover {
		background-color: ${({ theme }): string => theme.palette.gray2.hover};
	}
`;

const Bubble = styled.div<{ open: boolean }>`
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	top: 50%;
	left: -12px;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: ${({ theme }): string => theme.palette.gray2.regular};
	transition: background-color 0.2s, transform 0.2s;
	transform: scaleX(${({ open }): number => (open ? 1 : -1)});
	&:hover {
		background-color: ${({ theme }): string => theme.palette.gray2.hover};
	}
	&:active {
		background-color: ${({ theme }): string => theme.palette.gray2.hover};
	}
`;

export const Collapser: FunctionComponent<{ open: boolean; onClick: () => void }> = ({
	open,
	onClick
}) => (
	<VerticalDivider>
		<Bubble onClick={onClick} open={open}>
			<Icon size="medium" icon="ChevronLeft" />
		</Bubble>
	</VerticalDivider>
);
