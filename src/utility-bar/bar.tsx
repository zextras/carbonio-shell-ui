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
import { ACTION_TYPES, CUSTOM_EVENTS } from '../constants';
import { logout } from '../network/logout';
import { useAccountStore } from '../store/account';
import { getT } from '../store/i18n/hooks';
import { useActions } from '../store/integrations/hooks';
import { useTracker } from '../tracker/tracker';
import type { UtilityView } from '../types/apps';
import type { Action } from '../types/integrations';

export interface UtilityBarItemProps {
	view: UtilityView;
}

/**
 * Interface representing an account menu action.
 *
 * This interface extends the `Action` interface and omits the `label` and `onClick` properties
 * from the `DropdownItem` interface. It includes an `execute` function and a `position` property.
 *
 */
export interface AccountMenuAction extends Action, Omit<DropdownItem, 'label' | 'onClick'> {
	execute: NonNullable<DropdownItem['onClick']>;
	position: number;
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
	const account = useAccountStore((s) => s.account);
	const accountSettings = useAccountStore((s) => s.settings);
	// extDocs is an object that contains json e.g. { "Documentation" : "https://manuale.zextrascloud.it/" }'
	const extDocs = accountSettings?.attrs?.zimbraWebClientSupportedHelps || [];
	let documentationLink = '';
	let docLinkDisabled = true;
	const extraDopdownItems: DropdownItem[] = [];

	if (extDocs && extDocs !== '' && typeof extDocs === 'object' && Object.keys(extDocs).length > 0) {
		// extract every object then parse the json to get the link
		for (const key in extDocs) {
			const obj = extDocs[key];
			if (obj && obj !== '' && typeof obj === 'string') {
				const jsonToObject = JSON.parse(obj);
				if (jsonToObject && jsonToObject !== '' && 'Documentation' in jsonToObject) {
					documentationLink = jsonToObject['Documentation'];
					docLinkDisabled = false;
				} else if (jsonToObject && jsonToObject !== '') {
					// save a new dropdown item with the key and the link
					// get key and value from jsonToObject and create a new dropdown item with the key as label and value as link
					for (const key in jsonToObject) {
						const value = jsonToObject[key];
						if (value && value !== '' && typeof value === 'string') {
							extraDopdownItems.push({
								id: key.toLowerCase().replace(/\s/g, '-'),
								label: key,
								onClick: () => {
									window.open(value, '_blank', 'noopener,noreferrer');
								},
								icon: 'InfoOutline'
							});
						}
					}
				}
			}
		}
	} else {
		docLinkDisabled = true;
	}

	const updateViews = useCallback(() => {
		const updateViewEvent = new CustomEvent(CUSTOM_EVENTS.updateView);
		window.dispatchEvent(updateViewEvent);
	}, []);

	const { reset } = useTracker();

	const actions = useActions<undefined, AccountMenuAction>(undefined, ACTION_TYPES.ACCOUNT_MENU);
	const accountMenuItems = useMemo(
		(): DropdownItem[] =>
			actions
				.toSorted((a, b) => a.position - b.position)
				.map(({ execute, position: _position, ...action }) => ({
					onClick: execute,
					...action
				})),
		[actions]
	);

	// create onlick func to window target external link click
	const externalLinkClick = useCallback((): void => {
	    if (documentationLink && documentationLink !== '' && typeof documentationLink === 'string') {
			window.open(documentationLink, '_blank', 'noopener,noreferrer');
		} else {
			noop();
		}
	}, [documentationLink]);

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
			...accountMenuItems,
			{
				id: 'docs',
				label: t('label.documentation', 'Documentation'),
				onClick: () => externalLinkClick(),
				disabled: docLinkDisabled,
				icon: 'InfoOutline'
			},
			...extraDopdownItems,
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
		[account?.displayName, account?.name, accountMenuItems, reset, t, updateViews, docLinkDisabled, extraDopdownItems]
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
