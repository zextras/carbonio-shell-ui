/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import {
	Container,
	Dropdown,
	DropdownItem,
	IconButton,
	Tooltip
} from '@zextras/carbonio-design-system';
import { map, noop } from 'lodash';
import React, { FC, useCallback, useMemo } from 'react';
import type { UtilityView } from '../../types';
import { logout } from '../network/logout';
import { useUserAccount } from '../store/account';
import { addBoard } from '../store/boards';
import { getT } from '../store/i18n';
import { useUtilityBarStore } from './store';
import { useUtilityViews } from './utils';
import { SHELL_APP_ID } from '../constants';

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
	return <view.button mode={mode} setMode={setMode} />;
};

export const ShellUtilityBar = (): JSX.Element => {
	const views = useUtilityViews();
	const t = getT();
	const account = useUserAccount();
	const accountItems = useMemo<DropdownItem[]>(
		() => [
			{
				id: 'account',
				label: account?.displayName ?? 'Account',
				disabled: true
			},
			{
				id: 'email',
				label: account?.name ?? '',
				disabled: true,
				itemTextSize: 'small'
			},
			{
				type: 'divider',
				id: 'divider',
				label: 'divider'
			},
			{
				id: 'feedback',
				label: t('label.feedback', 'Feedback'),
				onClick: (): void => {
					addBoard(SHELL_APP_ID)({
						url: 'feedback',
						title: t('label.feedback', 'Feedback'),
						icon: 'MessageSquareOutline'
					});
				},
				icon: 'MessageSquareOutline'
			},
			{
				id: 'update',
				label: t('label.update_view', 'Update view'),
				onClick: noop,
				icon: 'Refresh'
			},
			{
				id: 'docs',
				label: t('label.documentation', 'Documentation'),
				onClick: noop,
				disabled: true,
				icon: 'InfoOutline'
			},
			{
				id: 'logout',
				label: t('label.logout', 'Logout'),
				onClick: logout,
				icon: 'LogOut'
			}
		],
		[account, t]
	);

	const viewItems = useMemo(
		() => map(views, (view) => <UtilityBarItem view={view} key={view.id} />),
		[views]
	);

	return (
		<Container orientation="horizontal" width="fit">
			{viewItems}
			<Tooltip label={account?.displayName ?? account?.name} placement="bottom-end">
				<Dropdown items={accountItems} maxWidth="18.75rem" disableAutoFocus>
					<IconButton icon="PersonOutline" size="large" onClick={noop} />
				</Dropdown>
			</Tooltip>
		</Container>
	);
};
