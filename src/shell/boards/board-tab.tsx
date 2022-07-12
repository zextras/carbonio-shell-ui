/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import {
	IconButton,
	Text,
	Row,
	Padding,
	Icon,
	Container,
	Tooltip
} from '@zextras/carbonio-design-system';
import { closeBoard, setCurrentBoard, useBoardStore } from '../../store/boards';

const TabContainer = styled(Row)`
	cursor: pointer;
	height: 28px;
	width: fit-content;
	user-select: none;
	background-color: ${({ theme, active }): string =>
		active ? theme.palette.gray3.regular : theme.palette.gray5.regular};
	border-radius: 2px;
	padding: 2px 4px;
`;

const VerticalDivider = styled(Container)`
	width: 1px;
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
	const [t] = useTranslation();
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
			{current !== id ? <VerticalDivider /> : null}
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
							padding={{ right: 'small' }}
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
						style={{ padding: '2px', width: '24px', height: '24px' }}
					/>
				</Tooltip>
			</TabContainer>
		</Container>
	);
};
