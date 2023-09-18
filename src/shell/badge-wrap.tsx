/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, forwardRef } from 'react';

import { Container, Badge } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import { BadgeInfo } from '../../types';

const MiniBadge = styled(Badge)`
	position: absolute;
	bottom: 25%;
	right: 25%;
	transform: translate(30%, 30%);
	min-width: 0.75rem;
	min-height: 0.75rem;
	pointer-events: none;
	z-index: 99;
	font-size: 0.625rem;
	padding: 0.125rem;
`;

const BadgeWrap: FC<{ badge: BadgeInfo }> = forwardRef<HTMLDivElement, { badge: BadgeInfo }>(
	({ badge, children }, ref) => (
		<Container width={'3rem'} height={'3rem'} style={{ position: 'relative' }} ref={ref}>
			{badge.show && <MiniBadge value={badge.count} type={'unread'} />}
			{children}
		</Container>
	)
);

BadgeWrap.displayName = 'BadgeWrap';

export default BadgeWrap;
