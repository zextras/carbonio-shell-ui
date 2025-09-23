/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { vi } from 'vitest';

const actualReactRouterDom = await vi.importActual('react-router-dom');

export default {
	...actualReactRouterDom,
	useBlocker: vi.fn().mockImplementation(() => ({
		state: 'unblocked',
		proceed: vi.fn()
	}))
};
