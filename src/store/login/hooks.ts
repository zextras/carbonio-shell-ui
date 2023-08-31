/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';

import { useLoginConfigStore } from './store';
import DefaultLogo from '../../../assets/carbonio.svg';
import { useDarkMode } from '../../dark-mode/use-dark-mode';

export function useLogo(): string | React.ComponentType {
	const { carbonioWebUiAppLogo, carbonioWebUiDarkAppLogo } = useLoginConfigStore();

	const { darkModeEnabled } = useDarkMode();

	return useMemo(() => {
		if (darkModeEnabled) {
			return carbonioWebUiDarkAppLogo || carbonioWebUiAppLogo || DefaultLogo;
		}
		return carbonioWebUiAppLogo || carbonioWebUiDarkAppLogo || DefaultLogo;
	}, [carbonioWebUiDarkAppLogo, carbonioWebUiAppLogo, darkModeEnabled]);
}
