/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useMemo } from 'react';

import type { DropdownItem } from '@zextras/carbonio-design-system';
import { Container, Dropdown, IconButton, Tooltip } from '@zextras/carbonio-design-system';
import { map, noop } from 'lodash';

import { useUtilityBarStore } from './store';
import { useUtilityViews } from './utils';
import { useTracker } from '../boot/posthog';
import { CUSTOM_EVENTS } from '../constants';
import { logout } from '../network/logout';
import { useUserAccount } from '../store/account';
import { getT } from '../store/i18n/hooks';
import type { UtilityView } from '../types/apps';

export interface UtilityBarItemProps {
	view: UtilityView;
}

const UtilityBarItem = ({ view }: UtilityBarItemProps): React.JSX.Element => {
	const { mode, setMode, current, setCurrent } = useUtilityBarStore();
	const onClick = useCallback((): void => {
		setMode((current !== view.id && 'open') || (mode !== 'open' && 'open') || 'closed');
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

export const ShellUtilityBar = (): React.JSX.Element => {
	const views = useUtilityViews();
	const t = getT();
	const account = useUserAccount();

	const updateViews = useCallback(() => {
		const updateViewEvent = new CustomEvent(CUSTOM_EVENTS.updateView);
		window.dispatchEvent(updateViewEvent);
	}, []);

	const { reset } = useTracker();

	const accountItems = useMemo(
		(): DropdownItem[] => [
			{
				id: 'account',
				label: account?.displayName ?? 'Account',
				disabled: true
			},
			{
				id: 'email',
				label: account?.name ?? '',
				disabled: true
			},
			{
				type: 'divider',
				id: 'divider',
				label: 'divider'
			},
			{
				id: 'update',
				label: t('label.update_view', 'Update view'),
				onClick: updateViews,
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
				onClick: (): void => {
					reset();
					logout();
				},
				icon: 'LogOut'
			}
		],
		[account?.displayName, account?.name, reset, t, updateViews]
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
