/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useMemo } from 'react';
import {
	Container,
	Tooltip,
	IconButton,
	Dropdown,
	Icon,
	DropdownItem
} from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useUtilityBarStore } from './store';
import { SHELL_APP_ID, UtilityView } from '../../types';
import { useUtilityViews } from './utils';
import { logout } from '../network/logout';
import { useContextBridge } from '../store/context-bridge';
import { noOp } from '../network/fetch';
import { useUserAccount } from '../store/account';

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

export const ShellUtilityBar: FC = () => {
	const views = useUtilityViews();
	const [t] = useTranslation();
	const account = useUserAccount();
	const accountItems = useMemo(
		() =>
			[
				{
					id: 'account',
					label: account?.displayName ?? account?.name ?? '',
					disabled: true
				},
				{
					type: 'divider',
					id: 'divider',
					label: 'divider'
				},
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
					id: 'update',
					label: t('label.update_view', 'Update view'),
					click: (): void => noOp(),
					icon: 'Refresh'
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
			] as DropdownItem[],
		[account, t]
	);
	return (
		<Container orientation="horizontal" width="fit">
			{map(views, (view) => (
				<UtilityBarItem view={view} key={view.id} />
			))}
			<Tooltip label={account?.displayName ?? account?.name} placement="bottom-end">
				<Dropdown items={accountItems} maxWidth="200px" disableAutoFocus>
					<Icon icon="PersonOutline" size="large" />
				</Dropdown>
			</Tooltip>
		</Container>
	);
};
