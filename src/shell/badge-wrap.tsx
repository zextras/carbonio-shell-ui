/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, forwardRef } from 'react';
import { Container, ContainerProps, Text } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { BadgeInfo } from '../../types';

const MiniBadge = styled(Container)<{ badge: BadgeInfo }>`
	position: absolute;
	bottom: 25%;
	right: 25%;
	transform: translate(30%, 30%);
	background: ${({ badge, theme }): string => theme.palette[badge?.color ?? 'primary'].regular};
	min-width: 12px;
	min-height: 12px;
	line-height: 12px;
	border-radius: 8px;
	user-select: none;
	cursor: pointer;
	pointer-events: none;
	z-index: 99;
`;

// eslint-disable-next-line react/display-name
const BadgeWrap: FC<{ badge: BadgeInfo }> = forwardRef<HTMLDivElement, { badge: BadgeInfo }>(
	({ badge, children }, ref) => (
		<Container width={48} height={48} style={{ position: 'relative' }} ref={ref}>
			{badge.show && (
				<MiniBadge badge={badge} height="fit" width="fit">
					{badge.showCount ? (
						<Text size="extrasmall" style={{ padding: '2px 4px', fontSize: '10px' }} color="gray6">
							{badge.count ?? 0}
						</Text>
					) : null}
				</MiniBadge>
			)}
			{children}
		</Container>
	)
);

export default BadgeWrap;
