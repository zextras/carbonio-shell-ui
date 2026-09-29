/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { StyleRuleOptions } from '@emotion/jest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

/*
 * Vitest 5 inlined the `expect` package and no longer picks up matcher
 * augmentations written against the global `jest` namespace, which is how both
 * @testing-library/jest-dom (7.0.1, via its `jest.d.ts`) and @emotion/jest
 * (11.14.2) still declare theirs. Until they register on vitest's own `Matchers`
 * interface, re-declare their matchers here so the assertions keep type-checking.
 */
declare module 'vitest' {
	interface Matchers<
		R extends void | Promise<void> = void,
		T = unknown
	> extends TestingLibraryMatchers<T, R> {
		toHaveStyleRule(property: string, value: unknown, options?: StyleRuleOptions): R;
	}
}
