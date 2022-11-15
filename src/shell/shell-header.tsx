/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {FC, useEffect, useMemo, useState} from 'react';
import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	Catcher,
	Button
} from '@zextras/carbonio-design-system';
import {find} from 'lodash';
import Logo from '../svg/carbonio.svg';
import { SearchBar } from '../search/search-bar';
import { CreationButton } from './creation-button';
import { useAppStore } from '../store/app';
import {useLoginConfigStore} from "../store/login";
import {useUserSettings} from "../store/account";
import {SHELL_APP_ID} from "../constants";
import {DRPropValues} from "../../types";
import {isEnabled as isDarkReaderEnabled} from 'darkreader';
import styled from "styled-components";

const CustomImg = styled.img`
	height: 2rem
`;

const ShellHeader: FC<{
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ mobileNavIsOpen, onMobileMenuClick, children }) => {

	const [darkMediaEnabled, setDarkMediaEnabled] = useState(isDarkReaderEnabled());

	const settings = useUserSettings();
	const currentDRMSetting = useMemo(
		() =>
			find(settings.props, { name: 'zappDarkreaderMode', zimlet: SHELL_APP_ID })
				?._content as DRPropValues,
		[settings]
	);

	useEffect(() => {
		if (currentDRMSetting !== "auto") {
			setDarkMediaEnabled(currentDRMSetting === 'enabled');
		}
	},[currentDRMSetting])

	const { carbonioWebUiAppLogo, carbonioWebUiDarkAppLogo } = useLoginConfigStore();

	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		setDarkMediaEnabled(event.matches);
	});

	const logoSrc = useMemo(() => {
		if (darkMediaEnabled) {
			return carbonioWebUiDarkAppLogo || carbonioWebUiAppLogo;
		} else {
			return carbonioWebUiAppLogo || carbonioWebUiDarkAppLogo;
		}
	}, [carbonioWebUiDarkAppLogo, carbonioWebUiAppLogo, darkMediaEnabled]);

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
						{logoSrc ? <CustomImg src={logoSrc} /> : <Logo height="2rem" />}
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
