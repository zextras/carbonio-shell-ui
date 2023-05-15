/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Button,
	Container,
	Dropdown,
	type DropdownItem,
	Row,
	Tooltip,
	useHiddenCount
} from '@zextras/carbonio-design-system';
import { isEmpty, map, noop, slice } from 'lodash';
import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { setCurrentBoard, useBoardStore } from '../../store/boards';
import { getT } from '../../store/i18n';
import { AppBoardTab } from './board-tab';
import { BOARD_HEADER_HEIGHT } from '../../constants';

export const TabsList = (): JSX.Element => {
	const t = getT();
	const { boards, current, expanded, orderedBoards } = useBoardStore();
	const tabContainerRef = useRef(null);
	// TODO: replace with useSplitVisibility?
	const [hiddenTabsCount, recalculateHiddenTabs] = useHiddenCount(tabContainerRef, expanded);

	useLayoutEffect(() => {
		recalculateHiddenTabs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [boards, expanded, tabContainerRef.current]);

	const boardHiddenItems = useMemo(
		(): DropdownItem[] =>
			map(slice(orderedBoards, -hiddenTabsCount), (boardId) => ({
				id: boardId,
				label: boards[boardId].title,
				icon: boards[boardId].icon,
				onClick: () => setCurrentBoard(boardId),
				selected: boardId === current
			})),
		[boards, current, hiddenTabsCount, orderedBoards]
	);

	return (
		<Row wrap="nowrap" height="100%" mainAlignment="flex-start" takeAvailableSpace>
			<Row
				ref={tabContainerRef}
				height={BOARD_HEADER_HEIGHT}
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
				width="calc(100% - 0.5rem)"
			>
				{boards &&
					!isEmpty(orderedBoards) &&
					map(orderedBoards, (boardId, index, array) => (
						<AppBoardTab
							key={boardId}
							id={boardId}
							title={boards[boardId].title}
							icon={boards[boardId].icon}
							fallbackId={current !== boardId ? undefined : array[index + 1] || array[index - 1]}
						/>
					))}
			</Row>
			{hiddenTabsCount > 0 && (
				<>
					<Container width="fit" padding={{ horizontal: 'extrasmall', vertical: 'extrasmall' }}>
						<Container width="0.0625rem" height="fill" background={'gray3'} />
					</Container>
					<Tooltip label={t('board.show_tabs', 'Show other tabs')} placement="top">
						<Dropdown width="fit" style={{ flexGrow: '1' }} items={boardHiddenItems}>
							<Button type="ghost" color="secondary" label={`+${hiddenTabsCount}`} onClick={noop} />
						</Dropdown>
					</Tooltip>
				</>
			)}
		</Row>
	);
};
