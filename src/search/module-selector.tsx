/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	Container,
	Row,
	Text,
	Icon,
	Dropdown,
	DropdownItem
} from '@zextras/carbonio-design-system';
import styled from 'styled-components';

import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';
import { useCurrentRoute, pushHistory } from '../history/hooks';
import { useAppStore } from '../store/app';

const SelectorContainer = styled(Container)<{ open?: boolean }>`
	border-right: 0.0625rem solid ${({ theme }): string => theme.palette.gray4.regular};
	cursor: pointer;
	background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].regular};

	&:hover {
		background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].hover};
	}
`;

interface ModuleSelectorProps {
	app: string | undefined;
}

const ModuleSelectorComponent = ({ app }: ModuleSelectorProps): JSX.Element | null => {
	const modules = useAppStore((s) => s.views.search);
	const { module, updateModule } = useSearchStore();

	const fullModule = useMemo(
		() => modules.find((m) => m.route === module) ?? modules[0],
		[module, modules]
	);

	const [open, setOpen] = useState(false);

	const dropdownItems = useMemo(
		(): DropdownItem[] =>
			modules.map(
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
		[modules, updateModule]
	);

	useEffect(() => {
		// FIXME: this is part of the cause of SHELL-46
		//    When the user click on the search module directly, the app results to be the search one,
		//    and so the selected module, which is kept to the last one selected, does not match the module
		//    written inside the path (/search/<module>), causing a misalignment between what is rendered (which
		//    follow the path) and what is written inside the module selector (which updates its value based on the
		//    module where the user is coming from)
		if (app !== SEARCH_APP_ID && (!fullModule || fullModule?.app !== app)) {
			updateModule((modules.find((m) => m.app === app) ?? modules[0])?.route);
		}
	}, [app, fullModule, modules, updateModule]);

	const openDropdown = useCallback(() => {
		setOpen(true);
	}, []);

	const closeDropdown = useCallback(() => {
		setOpen(false);
	}, []);

	if (!fullModule) {
		return null;
	}

	// TODO: replace the Dropdown with a Select with the customLabelFactory
	return (
		<Dropdown items={dropdownItems} onOpen={openDropdown} onClose={closeDropdown}>
			<SelectorContainer
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
						{fullModule?.label}
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

export const ModuleSelector = (): JSX.Element => {
	const activeRoute = useCurrentRoute();
	return <MemoModuleSelector app={activeRoute?.app} />;
};
