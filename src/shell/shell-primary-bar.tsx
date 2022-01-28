/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Container, IconButton, Row, Tooltip } from '@zextras/carbonio-design-system';
import { map, isEmpty } from 'lodash';
import React, { useContext, FC } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// TODO: convert boards management to ts (and maybe a zustand store)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardValueContext, BoardSetterContext } from './boards/board-context';
import { useRoutes } from '../store/app/hooks';
import { useAppStore } from '../store/app/store';
import { AppRoute } from '../../types';

const ContainerWithDivider = styled(Container)`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray3.regular};
`;

const ToggleBoardIcon: FC = () => {
	const { boards, minimized } = useContext(BoardValueContext);
	const { toggleMinimized } = useContext(BoardSetterContext);

	if (isEmpty(boards)) return null;
	return (
		<IconButton
			iconColor="primary"
			icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
			onClick={toggleMinimized}
			size="large"
		/>
	);
};

const ShellPrimaryBar: FC<{ activeRoute: AppRoute }> = ({ activeRoute }) => {
	const primaryBarViews = useAppStore((s) => s.views.primaryBar);
	const primaryBarAccessoryViews = useAppStore((s) => s.views.primaryBarAccessories);
	const history = useHistory();
	const [t] = useTranslation();

	return (
		<ContainerWithDivider
			width={49}
			height="fill"
			background="gray6"
			orientation="vertical"
			mainAlignment="flex-start"
		>
			<Row
				mainAlignment="flex-start"
				orientation="vertical"
				takeAvailableSpace
				wrap="nowrap"
				style={{ minHeight: '1px', overflowY: 'overlay' }}
			>
				{map(primaryBarViews, (view) => {
					if (!view.visible) {
						return null;
					}
					if (typeof view.component === 'string') {
						return (
							<Tooltip label={view.label} placement="right" key={view.id}>
								<IconButton
									icon={view.component}
									backgroundColor={activeRoute.id === view.id ? 'gray4' : 'gray6'}
									iconColor={activeRoute.id === view.id ? 'primary' : 'text'}
									onClick={(): void => history.push(view.route)}
									size="large"
								/>
							</Tooltip>
						);
					}
					return <view.component active={view.id === activeRoute.id} />;
				})}
			</Row>
			<Row>
				<ToggleBoardIcon />
			</Row>
		</ContainerWithDivider>
	);
};

export default ShellPrimaryBar;
