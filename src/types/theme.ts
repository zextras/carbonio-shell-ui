/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { CSSProperties } from 'react';

import type { ThemeColorObj } from '@zextras/carbonio-design-system';

declare module '@zextras/carbonio-design-system' {
	interface Theme {
		globalCursors: CSSProperties['cursor'][];
	}

	interface Palette {
		shared: ThemeColorObj;
		linked: ThemeColorObj;
	}
}
