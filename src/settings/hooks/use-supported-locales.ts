/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEffect, useState } from 'react';

import { FALLBACK_SUPPORTED_LOCALES, loadSupportedLocales } from '../../constants/supported-locales';

export const useSupportedLocales = (): Array<string> => {
	const [supportedLocales, setSupportedLocales] = useState<Array<string>>(FALLBACK_SUPPORTED_LOCALES);

	useEffect(() => {
		let isMounted = true;

		loadSupportedLocales().then((loadedSupportedLocales) => {
			if (isMounted) {
				setSupportedLocales(loadedSupportedLocales);
			}
		});

		return (): void => {
			isMounted = false;
		};
	}, []);

	return supportedLocales;
};
