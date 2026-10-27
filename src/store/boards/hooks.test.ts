/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { BoardHooksContext } from './hooks';

describe('BoardHooksContext', () => {
	// The modules build objects of this type in their mocks: a member added after the first
	// release must stay optional, otherwise their type-check breaks at the next shell update.
	it('can be built without the members added after its first release', () => {
		const hooksOfAnOlderShell: BoardHooksContext = {
			closeBoard: vi.fn(),
			updateBoard: vi.fn(),
			setCurrentBoard: vi.fn(),
			getBoardContext: vi.fn(),
			getBoard: vi.fn()
		};
		expect(hooksOfAnOlderShell.setContentStatus).toBeUndefined();
	});
});
