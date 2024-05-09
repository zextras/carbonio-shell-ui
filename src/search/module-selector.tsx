/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { DropdownItem } from '@zextras/carbonio-design-system';
import { Container, Row, Text, Icon, Dropdown } from '@zextras/carbonio-design-system';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';
import { useCurrentRoute, pushHistory } from '../history/hooks';
import { getAppList, useAppStore } from '../store/app';

const SelectorContainer = styled(Container)<{ open?: boolean }>`
	border-right: 0.0625rem solid ${({ theme }): string => theme.palette.gray4.regular};
	cursor: pointer;
	background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].regular};

	&:hover {
		background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].hover};
	}
`;

interface ModuleSelectorProps {
	activeRoute: string | undefined;
}

const ModuleSelectorComponent = ({
	activeRoute
}: ModuleSelectorProps): React.JSX.Element | null => {
	const searchViews = useAppStore((s) => s.views.search);
	const { module, updateModule } = useSearchStore();
	const searchView = useMemo(
		() => searchViews.find((m) => m.route === module),
		[module, searchViews]
	);

	// TODO replace with useParams when available
	const { pathname } = useLocation();
	const searchModulePath = useMemo(() => pathname.replace(`/${SEARCH_APP_ID}/`, ''), [pathname]);

	const [open, setOpen] = useState(false);

	const dropdownItems = useMemo(
		(): DropdownItem[] =>
			searchViews.map(
				({ id, label, icon, route }): DropdownItem => ({
					id,
					label,
					icon,
					onClick: (): void => {
						updateModule(route);
						pushHistory({ route: SEARCH_APP_ID, path: `/${route}` });
					}
				})
			),
		[searchViews, updateModule]
	);

	useEffect(() => {
		if (
			activeRoute &&
			activeRoute !== SEARCH_APP_ID &&
			module !== activeRoute &&
			searchViews.find((m) => m.route === activeRoute)
		) {
			updateModule(activeRoute);
		} else if (
			activeRoute === SEARCH_APP_ID &&
			module === undefined &&
			searchViews.find((m) => m.route === searchModulePath)
		) {
			updateModule(searchModulePath);
		} else if (module === undefined) {
			const view = searchViews.find((m) => m.app === getAppList()[0].name);
			if (view) {
				updateModule(view.route);
			}
		}
	}, [searchView, module, searchViews, updateModule, activeRoute, pathname, searchModulePath]);

	const openDropdown = useCallback(() => {
		setOpen(true);
	}, []);

	const closeDropdown = useCallback(() => {
		setOpen(false);
	}, []);

	if (!searchView) {
		return null;
	}

	// TODO: replace the Dropdown with a Select with the customLabelFactory
	return (
		<Dropdown items={dropdownItems} onOpen={openDropdown} onClose={closeDropdown}>
			<SelectorContainer
				data-testid="HeaderModuleSelector"
				orientation="horizontal"
				height="2.625rem"
				width="fit"
				minWidth="9.375rem"
				crossAlignment="center"
				mainAlignment="space-between"
				borderRadius="half"
			>
				<Row takeAvailableSpace mainAlignment="unset" padding={{ left: 'small' }}>
					<Text size="small" color={open ? 'primary' : 'text'}>
						{searchView?.label}
					</Text>
				</Row>
				<Icon
					size="large"
					icon={open ? 'ChevronUpOutline' : 'ChevronDownOutline'}
					color={open ? 'primary' : 'text'}
					style={{ alignSelf: 'center' }}
				/>
			</SelectorContainer>
		</Dropdown>
	);
};

const MemoModuleSelector = React.memo(ModuleSelectorComponent);

export const ModuleSelector = (): React.JSX.Element => {
	const activeRoute = useCurrentRoute();
	return <MemoModuleSelector activeRoute={activeRoute?.route} />;
};
