/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useMemo } from 'react';
import { Container, Tooltip, IconButton, Dropdown } from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useUtilityBarStore } from './store';
import { SHELL_APP_ID, UtilityView } from '../../types';
import { useUtilityViews } from './utils';
import { logout } from '../network/logout';
import { useContextBridge } from '../store/context-bridge';

const UtilityBarItem: FC<{ view: UtilityView }> = ({ view }) => {
	const { mode, setMode, current, setCurrent } = useUtilityBarStore();
	const onClick = useCallback((): void => {
		// eslint-disable-next-line no-nested-ternary
		setMode(current !== view.id ? 'open' : mode !== 'open' ? 'open' : 'closed');
		setCurrent(view.id);
	}, [current, mode, setCurrent, setMode, view.id]);
	if (typeof view.button === 'string') {
		return (
			<Tooltip label={view.label} placement="bottom-end">
				<IconButton
					icon={view.button}
					iconColor={current === view.id ? 'primary' : 'text'}
					onClick={onClick}
					size="large"
				/>
			</Tooltip>
		);
	}
	return <view.button />;
};

export const ShellUtilityBar: FC = () => {
	const views = useUtilityViews();
	const [t] = useTranslation();
	const accountItems = useMemo(
		() => [
			{
				id: 'feedback',
				label: t('label.feedback', 'Feedback'),
				click: () =>
					useContextBridge.getState().packageDependentFunctions?.addBoard(SHELL_APP_ID)(
						'/feedback/',
						{ title: t('label.feedback', 'Feedback') }
					),
				icon: 'MessageSquareOutline'
			},
			{
				id: 'docs',
				label: t('label.documentation', 'Documentation'),
				// TODO: Replace when the correct link is available
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				click: (): void => {},
				disabled: true,
				icon: 'InfoOutline'
			},
			{
				id: 'logout',
				label: t('label.logout', 'Logout'),
				click: logout,
				icon: 'LogOut'
			}
		],
		[t]
	);
	return (
		<Container orientation="horizontal" width="fit">
			{map(views, (view) => (
				<UtilityBarItem view={view} key={view.id} />
			))}
			<Tooltip label={t('label.account_menu', 'Account menu')} placement="left-end">
				<Dropdown items={accountItems}>
					<IconButton icon="PersonOutline" size="large" />
				</Dropdown>
			</Tooltip>
		</Container>
	);
};
