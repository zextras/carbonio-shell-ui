/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Container, Badge, Icon } from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import type { BadgeInfo } from '../types/apps';

const MiniBadge = styled(Badge)`
	position: absolute;
	bottom: 25%;
	right: 25%;
	transform: translate(30%, 30%);
	min-width: 1rem;
	min-height: 1rem;
	pointer-events: none;
	z-index: 99;
	padding: 0.125rem;

	& > div {
		font-size: 0.625rem;
		line-height: normal;
	}
`;

const MiniIcon = styled(Icon)`
	position: absolute;
	bottom: 25%;
	right: 25%;
	transform: translate(30%, 30%);
	user-select: none;
	cursor: pointer;
	pointer-events: none;
	z-index: 99;
`;

const BadgeWrap = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ badge: BadgeInfo }>>(
	function BadgeWrapFn({ badge, children }, ref): React.JSX.Element {
		return (
			<Container width={'3rem'} height={'3rem'} style={{ position: 'relative' }} ref={ref}>
				{(badge.show && badge.icon && <MiniIcon icon={badge.icon} color={badge.color} />) ||
					(badge.show && (
						<MiniBadge
							color={'gray6'}
							backgroundColor={badge.color ?? 'primary'}
							data-testid={'badge-counter'}
							value={badge.showCount ? badge.count ?? 0 : ''}
						/>
					))}
				{children}
			</Container>
		);
	}
);

export default BadgeWrap;
