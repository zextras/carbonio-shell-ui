/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import styled from '@emotion/styled';
import { Row } from '@zextras/carbonio-design-system';
import { isEmpty, map } from 'lodash';

import { AppBoardTab } from './board-tab';
import { useBoardStore } from '../../store/boards';

const CustomRow = styled(Row)`
	overflow-x: auto;
	&::-webkit-scrollbar {
		height: 0.5rem;
	}
`;

export const TabsList = (): React.JSX.Element => {
	const boards = useBoardStore((s) => s.boards);
	const orderedBoards = useBoardStore((s) => s.orderedBoards);
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
