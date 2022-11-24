/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Theme as DSTheme } from '@zextras/carbonio-design-system';

declare module 'styled-components' {
	interface DefaultTheme extends DSTheme {
		palette: DSTheme['palette'] & {
			shared: DSTheme['palette'][string];
			linked: DSTheme['palette'][string];
		};
	}
}
