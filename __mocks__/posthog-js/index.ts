/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type posthogJs from 'posthog-js';

const posthog = {
	init: vi.fn(),
	__loaded: false
} as unknown as typeof posthogJs;

export default posthog;
