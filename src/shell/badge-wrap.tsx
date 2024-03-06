/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { FC } from 'react';
import React, { forwardRef } from 'react';

import { Container, Badge } from '@zextras/carbonio-design-system';
import type { DefaultTheme } from 'styled-components';
import styled from 'styled-components';

import type { BadgeInfo } from '../types/apps';

const MiniBadge = styled(Badge)<{ $color?: keyof DefaultTheme['palette'] }>`
	position: absolute;
	bottom: 25%;
	right: 25%;
	transform: translate(30%, 30%);
	min-width: 0.75rem;
	min-height: 0.75rem;
	pointer-events: none;
	z-index: 99;
	font-size: 0.625rem;
	background: ${({ $color, theme }): string => theme.palette[$color ?? 'primary'].regular};
	padding: 0.125rem;
	color: ${({ theme }): string => theme.palette.gray6.regular};
`;

const BadgeWrap: FC<{ badge: BadgeInfo }> = forwardRef<HTMLDivElement, { badge: BadgeInfo }>(
	function BadgeWrapFn({ badge, children }, ref): JSX.Element {
		return (
			<Container width={'3rem'} height={'3rem'} style={{ position: 'relative' }} ref={ref}>
				{badge.show && (
					<MiniBadge
						data-testid={'badge-counter'}
						value={badge.showCount ? badge.count ?? 0 : ''}
					/>
				)}
				{children}
			</Container>
		);
	}
);

export default BadgeWrap;
