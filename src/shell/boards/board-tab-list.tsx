/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { map, slice } from 'lodash';
import React, { useRef, useLayoutEffect, FC } from 'react';
import {
	Container,
	Row,
	Dropdown,
	Button,
	useHiddenCount,
	Tooltip
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { setCurrentBoard, useBoardStore } from '../../store/boards';
import { AppBoardTab } from './board-tab';

export const TabsList: FC = () => {
	const [t] = useTranslation();
	const { boards, current, expanded } = useBoardStore();
	const tabContainerRef = useRef();
	const [hiddenTabsCount, recalculateHiddenTabs] = useHiddenCount(tabContainerRef, expanded);

	useLayoutEffect(() => {
		recalculateHiddenTabs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [boards, expanded, tabContainerRef.current]);

	return (
		<Row wrap="nowrap" height="100%" mainAlignment="flex-start" takeAvailableSpace>
			<Row
				ref={tabContainerRef}
				height="48px"
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
				width="calc(100% - 8px)"
			>
				{boards &&
					map(boards, (tab) => (
						<AppBoardTab key={tab.id} id={tab.id} title={tab.title} icon={tab.icon} />
					))}
			</Row>
			{hiddenTabsCount > 0 && (
				<>
					<Container width="fit" padding={{ horizontal: 'extrasmall', vertical: 'extrasmall' }}>
						<Container width="1px" height="fill" background="gray3" />
					</Container>
					<Tooltip label={t('board.show_tabs', 'Show other tabs')} placement="top">
						<Dropdown
							width="fit"
							style={{ flexGrow: '1' }}
							items={map(slice(Object.values(boards), -hiddenTabsCount), (tab) => ({
								id: tab.id,
								label: tab.title,
								icon: tab.icon,
								click: () => setCurrentBoard(tab.id),
								selected: tab.id === current
							}))}
						>
							<Button
								type="ghost"
								color="secondary"
								label={`+${hiddenTabsCount}`}
								padding={{ all: 'extrasmall' }}
							/>
						</Dropdown>
					</Tooltip>
				</>
			)}
		</Row>
	);
};
