/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Container, Row, Text, Icon, Dropdown } from '@zextras/carbonio-design-system';
import { AppRoute } from '../../types';
import { useAppStore } from '../store/app';
import { useSearchStore } from './search-store';
import { SEARCH_APP_ID } from '../constants';
import { pushHistory } from '../history/hooks';

const SelectorContainer = styled(Container)<{ open?: boolean }>`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray4.regular};
	cursor: pointer;
	background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].regular};

	&:hover {
		background: ${({ theme, open }): string => theme.palette[open ? 'gray5' : 'gray6'].hover};
	}
`;

export const ModuleSelector: FC<{ activeRoute: AppRoute; disabled: boolean }> = ({
	activeRoute
}) => {
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
		if (activeRoute?.app !== SEARCH_APP_ID) {
			if (!fullModule || fullModule?.app !== activeRoute?.app) {
				updateModule((modules.find((m) => m.app === activeRoute?.app) ?? modules[0])?.route);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeRoute, modules, updateModule]);

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
