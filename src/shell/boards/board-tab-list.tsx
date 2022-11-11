/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Button,
	Container,
	Dropdown,
	Row,
	Tooltip,
	useHiddenCount
} from '@zextras/carbonio-design-system';
import { map, noop, slice } from 'lodash';
import React, { FC, useLayoutEffect, useRef } from 'react';
import { setCurrentBoard, useBoardStore } from '../../store/boards';
import { getT } from '../../store/i18n';
import { AppBoardTab } from './board-tab';

export const TabsList: FC = () => {
	const t = getT();
	const { boards, current, expanded } = useBoardStore();
	const tabContainerRef = useRef(null);
	const [hiddenTabsCount, recalculateHiddenTabs] = useHiddenCount(tabContainerRef, expanded);

	useLayoutEffect(() => {
		recalculateHiddenTabs();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [boards, expanded, tabContainerRef.current]);

	return (
		<Row wrap="nowrap" height="100%" mainAlignment="flex-start" takeAvailableSpace>
			<Row
				ref={tabContainerRef}
				height="3rem"
				mainAlignment="flex-start"
				style={{ overflow: 'hidden' }}
				width="calc(100% - 0.5rem)"
			>
				{boards &&
					map(boards, (tab) => (
						<AppBoardTab key={tab.id} id={tab.id} title={tab.title} icon={tab.icon} />
					))}
			</Row>
			{hiddenTabsCount > 0 && (
				<>
					<Container width="fit" padding={{ horizontal: 'extrasmall', vertical: 'extrasmall' }}>
						<Container width="0.0625rem" height="fill" background="gray3" />
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
							<Button type="ghost" color="secondary" label={`+${hiddenTabsCount}`} onClick={noop} />
						</Dropdown>
					</Tooltip>
				</>
			)}
		</Row>
	);
};
