/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type React from 'react';
import { useMemo } from 'react';

import type { FeatureFlags } from './store';
import { useLoginConfigStore } from './store';
import DefaultLogo from '../../../assets/carbonio.svg';
import { useDarkMode } from '../../dark-mode/use-dark-mode';

export function useLogo(): string | React.ComponentType {
	const carbonioWebUiAppLogo = useLoginConfigStore((s) => s.carbonioWebUiAppLogo);
	const carbonioWebUiDarkAppLogo = useLoginConfigStore((s) => s.carbonioWebUiDarkAppLogo);

	const { darkModeEnabled } = useDarkMode();

	return useMemo(() => {
		if (darkModeEnabled) {
			return carbonioWebUiDarkAppLogo ?? carbonioWebUiAppLogo ?? DefaultLogo;
		}
		return carbonioWebUiAppLogo ?? carbonioWebUiDarkAppLogo ?? DefaultLogo;
	}, [carbonioWebUiDarkAppLogo, carbonioWebUiAppLogo, darkModeEnabled]);
}

/**
 * Hook useful to know if is Carbonio CE or not
 */
export function useIsCarbonioCE(): boolean | undefined {
	return useLoginConfigStore((state) => state.isCarbonioCE);
}

/**
 * Hook useful to read a specific feature flag value
 */
export function useFeatureFlag<K extends keyof FeatureFlags>(key: K): boolean | undefined {
	return useLoginConfigStore((state) => state.featureFlags?.[key]);
}
