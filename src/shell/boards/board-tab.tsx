/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	Icon,
	IconButton,
	Padding,
	Row,
	RowProps,
	Text,
	Tooltip
} from '@zextras/carbonio-design-system';
import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { closeBoard, setCurrentBoard, useBoardStore } from '../../store/boards';
import { getT } from '../../store/i18n';

const TabContainer = styled(Row)<RowProps & { active: boolean }>`
	cursor: pointer;
	height: 1.75rem;
	width: fit-content;
	user-select: none;
	background-color: ${({ theme, active }): string =>
		active ? theme.palette.gray3.regular : theme.palette.gray5.regular};
	border-radius: 0.125rem;
	padding: 0.125rem 0.25rem;
`;

const VerticalDivider = styled(Container)`
	width: 0.0625rem;
	height: 100%;
	background: ${({ theme }): string => theme.palette.gray3.regular};
	margin: ${({ theme }): string => theme.sizes.padding.extrasmall};
`;

export const AppBoardTab: FC<{ id: string; icon: string; title: string }> = ({
	id,
	icon,
	title
}) => {
	const current = useBoardStore((s) => s.current);
	const t = getT();
	const onClick = useCallback(() => setCurrentBoard(id), [id]);
	const onRemove = useCallback(
		(ev) => {
			ev.stopPropagation();
			closeBoard(id);
		},
		[id]
	);

	return (
		<Container orientation="row" width="fit" maxWidth="100%">
			{current !== id && <VerticalDivider />}
			<TabContainer active={current === id} padding={{ all: 'extrasmall' }}>
				<Row
					height="100%"
					onClick={onClick}
					takeAvailableSpace
					mainAlignment="flex-start"
					wrap="nowrap"
				>
					<Icon icon={icon} size="large" />
					<Padding right="small" />
					<Tooltip label={title} placement="top" maxWidth="700px">
						<Text
							size="medium"
							weight="regular"
							color={current === id ? 'text' : 'secondary'}
							overflow="ellipsis"
						>
							{title}
						</Text>
					</Tooltip>
				</Row>
				<Padding right="small" />
				<Tooltip label={t('board.close_tab', 'Close Tab')} placement="top">
					<IconButton
						iconColor="secondary"
						icon="Close"
						onClick={onRemove}
						style={{ padding: '0.125rem', width: '1.5rem', height: '1.5rem' }}
					/>
				</Tooltip>
			</TabContainer>
		</Container>
	);
};
