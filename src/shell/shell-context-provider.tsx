/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useMemo } from 'react';
import { useScreenMode } from '@zextras/carbonio-design-system';
import ShellContext from './shell-context';

const ShellContextProvider: FC<{ children: unknown }> = ({ children }) => {
	const screenMode = useScreenMode();

	const value = useMemo(
		() => ({
			isMobile: screenMode === 'mobile'
		}),
		[screenMode]
	);

	return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
};

export default ShellContextProvider;
