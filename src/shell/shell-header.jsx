/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useMemo } from 'react';
import { reduce, map } from 'lodash';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Dropdown,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	MultiButton
} from '@zextras/carbonio-design-system';
import { useAppStore, useApps } from '../store/app';
import Logo from '../svg/carbonio-beta.svg';

export default function ShellHeader({ activeRoute, mobileNavIsOpen, onMobileMenuClick, children }) {
	const [t] = useTranslation();
	const screenMode = useScreenMode();
	const apps = useApps();

	const [primaryAction, secondaryActions] = useAppStore((s) => [
		apps[activeRoute?.app]?.newButton?.primary,
		reduce(
			s.apps,
			(acc, app, key) => {
				if (app.newButton?.secondaryItems) {
					if (acc.length > 0) {
						acc.push({ type: 'divider', id: key, key, label: 'really?' });
					}
					if (app.newButton?.primary) {
						acc.push(app.newButton?.primary);
					}
					acc.push(
						...map(app.newButton?.secondaryItems, (item) => ({
							...item,
							key: item.id,
							disabled: item.disabled || item.getDisabledStatus?.()
						}))
					);
				}
				return acc;
			},
			[]
		)
	]);

	const isMultiButtonDisabled = useMemo(
		() => !!primaryAction || primaryAction?.disabled || primaryAction?.getDisabledState?.(),
		[primaryAction]
	);

	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="60px"
			minHeight="60px"
			maxHeight="60px"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Container orientation="horizontal" width="75%" maxWidth="75%" mainAlignment="space-between">
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Logo height="32px" />
				<Padding horizontal="large">
					<MultiButton
						style={{ height: '44px' }}
						background="primary"
						label={t('new', 'New')}
						onClick={primaryAction?.click}
						items={secondaryActions}
						disabled={isMultiButtonDisabled}
					/>
				</Padding>
				<Responsive mode="desktop">
					{/* <SearchBar
						currentAppView={currentAppView}
						primaryAction={primaryAction}
						secondaryActions={secondaryActions}
					/> */}
				</Responsive>
			</Container>
			<Container orientation="horizontal" width="25%" mainAlignment="flex-end">
				<Responsive mode="desktop">{children}</Responsive>
				<Responsive mode="mobile">
					<Container
						orientation="horizontal"
						mainAlignment="flex-end"
						padding={{ right: 'extrasmall' }}
					>
						<Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown>
					</Container>
				</Responsive>
			</Container>
		</Container>
	);
}
