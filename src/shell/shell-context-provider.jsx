import React, { useMemo } from 'react';
import { useScreenMode } from '@zextras/zapp-ui';
import ShellContext from './shell-context';

export default function ShellContextProvider({ children }) {
	const screenMode = useScreenMode();

	const value = useMemo(
		() => ({
			isMobile: screenMode === 'mobile'
		}),
		[screenMode]
	);

	return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
