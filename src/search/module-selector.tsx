/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Container, Dropdown, Icon, Row, Text } from '@zextras/carbonio-design-system';
import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { SEARCH_APP_ID } from '../constants';
import { pushHistory, useCurrentRoute } from '../history/hooks';
import { useAppStore } from '../store/app';
import { useSearchStore } from './search-store';

const SelectorContainer = styled(Container)<{ open?: boolean }>`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray4.regular};
	cursor: pointer;
	background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].regular};

	&:hover {
		background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].hover};
	}
`;

const ModuleSelectorComponent: FC<{ app: string | undefined }> = ({ app }) => {
	const modules = useAppStore((s) => s.views.search);
	const { module, updateModule } = useSearchStore();
	const fullModule = useMemo(
		() => modules.find((m) => m.route === module) ?? modules[0],
		[module, modules]
	);

	const [open, setOpen] = useState(false);

	const dropdownItems = useMemo(
		() =>
			modules.map(({ id, label, icon, route }) => ({
				id,
				label,
				icon,
				active: id === module,
				click: (): void => {
					updateModule(route);
					pushHistory({ route: SEARCH_APP_ID, path: `/${route}` });
				}
			})),
		[module, modules, updateModule]
	);

	useEffect(() => {
		if (app !== SEARCH_APP_ID) {
			if (!fullModule || fullModule?.app !== app) {
				updateModule((modules.find((m) => m.app === app) ?? modules[0])?.route);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [app, modules, updateModule]);

	if (!fullModule) {
		return null;
	}
	return (
		<Dropdown
			items={dropdownItems}
			onOpen={(): void => setOpen(true)}
			onClose={(): void => setOpen(false)}
		>
			<SelectorContainer
				orientation="horizontal"
				height={42}
				width="fit"
				minWidth={150}
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
