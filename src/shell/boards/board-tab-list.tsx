/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Row } from '@zextras/carbonio-design-system';
import { isEmpty, map } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { useBoardStore } from '../../store/boards';
import { getT } from '../../store/i18n';
import { AppBoardTab } from './board-tab';

const CustomRow = styled(Row)`
	overflow-x: auto;
	&::-webkit-scrollbar {
		height: 0.5rem;
	}
`;

export const TabsList = (): JSX.Element => {
	const { boards, orderedBoards } = useBoardStore();
	return (
		<CustomRow wrap="nowrap" height="100%" mainAlignment="flex-start" takeAvailableSpace>
			{boards &&
				!isEmpty(orderedBoards) &&
				map(orderedBoards, (boardId, idx) => (
					<AppBoardTab
						key={boardId}
						id={boardId}
						title={boards[boardId].title}
						icon={boards[boardId].icon}
						firstTab={idx === 0}
					/>
				))}
		</CustomRow>
	);
};
