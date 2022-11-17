/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect, useMemo, useState } from 'react';
import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	Catcher
} from '@zextras/carbonio-design-system';
import { find, size } from 'lodash';
import styled from 'styled-components';
import Logo from '../svg/carbonio.svg';
import { SearchBar } from '../search/search-bar';
import { CreationButton } from './creation-button';
import { useAppStore } from '../store/app';
import { useLoginConfigStore } from '../store/login/store';
import { useUserSettings } from '../store/account';
import {
	isZappDarkreaderModeZimletProp,
	ZappDarkreaderModeZimletProp,
	ZimletProp
} from '../../types';

const CustomImg = styled.img`
	height: 2rem;
`;

const ShellHeader: FC<{
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ mobileNavIsOpen, onMobileMenuClick, children }) => {
	const { carbonioWebUiAppLogo, carbonioWebUiDarkAppLogo, carbonioWebUiDarkMode } =
		useLoginConfigStore();
	const settings = useUserSettings();
	const settingReceived = useMemo(
		() => size(settings.prefs) > 0 || size(settings.attrs) > 0 || size(settings.props) > 0,
		[settings]
	);
	const [darkModeEnabled, setDarkModeEnabled] = useState(false);

	useEffect(() => {
		if (settingReceived) {
			const result = find<ZimletProp, ZappDarkreaderModeZimletProp>(
				settings.props,
				(value): value is ZappDarkreaderModeZimletProp => isZappDarkreaderModeZimletProp(value)
			)?._content;
			if (result) {
				setDarkModeEnabled(
					(result === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
						result === 'enabled'
				);
			} else {
				setDarkModeEnabled(
					carbonioWebUiDarkMode ?? window.matchMedia('(prefers-color-scheme: dark)').matches
				);
			}
		}
	}, [settings, carbonioWebUiDarkMode, settingReceived]);

	useEffect(() => {
		const setCallback = (event: MediaQueryListEvent): void => {
			setDarkModeEnabled(event.matches);
		};
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setCallback);
		return (): void => {
			window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', setCallback);
		};
	}, []);

	const logoSrc = useMemo(() => {
		if (darkModeEnabled) {
			return carbonioWebUiDarkAppLogo || carbonioWebUiAppLogo;
		}
		return carbonioWebUiAppLogo || carbonioWebUiDarkAppLogo;
	}, [carbonioWebUiDarkAppLogo, carbonioWebUiAppLogo, darkModeEnabled]);

	const screenMode = useScreenMode();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="3.75rem"
			minHeight="3.75rem"
			maxHeight="3.75rem"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Catcher>
				<Container
					orientation="horizontal"
					maxWidth="75%"
					mainAlignment="flex-start"
					minWidth="fit-content"
				>
					<Responsive mode="mobile">
						<Padding right="small">
							<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
						</Padding>
					</Responsive>
					<Container width="15.625rem" height="2rem" crossAlignment="flex-start">
						{settingReceived && (
							<>{logoSrc ? <CustomImg src={logoSrc} /> : <Logo height="2rem" />}</>
						)}
					</Container>
					<Padding horizontal="large">
						<CreationButton />
					</Padding>
					<Responsive mode="desktop">{searchEnabled && <SearchBar />}</Responsive>
				</Container>
				<Container orientation="horizontal" width="auto" mainAlignment="flex-end">
					<Responsive mode="desktop">{children}</Responsive>
					<Responsive mode="mobile">
						<Container
							orientation="horizontal"
							mainAlignment="flex-end"
							padding={{ right: 'extrasmall' }}
						>
							{/* <Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown> */}
						</Container>
					</Responsive>
				</Container>
			</Catcher>
		</Container>
	);
};
export default ShellHeader;
