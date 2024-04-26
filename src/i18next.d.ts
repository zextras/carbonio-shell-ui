/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
// import the original type declarations
import type * as i18next from 'i18next';

// import all namespaces (for the default language, only)
import type en from '../translations/en.json';

declare module 'i18next' {
	// Extend CustomTypeOptions
	interface CustomTypeOptions {
		// custom resources type
		resources: {
			[defaultNs: i18next.TypeOptions['defaultNS']]: typeof en;
		};
		returnNull: false;
		jsonFormat: 'v4';
		allowObjectInHTMLChildren: true;
	}
}
