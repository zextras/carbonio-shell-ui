/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getBoardIcon, hasPendingChanges } from './utils';
import type { BoardContentStatus } from '../../types/boards';

describe('hasPendingChanges', () => {
	test.each<[BoardContentStatus | undefined, boolean]>([
		['dirty', true],
		['saving', true],
		['saved', false],
		['pristine', false],
		[undefined, false]
	])('with contentStatus %s returns %s', (contentStatus, expected) => {
		expect(hasPendingChanges({ contentStatus })).toBe(expected);
	});

	test('returns false for an undefined board', () => {
		expect(hasPendingChanges(undefined)).toBe(false);
	});
});

describe('getBoardIcon', () => {
	test.each<BoardContentStatus>(['dirty', 'saving'])(
		'returns the dirty icon when contentStatus is %s',
		(contentStatus) => {
			expect(getBoardIcon({ icon: 'Icon', dirtyIcon: 'DirtyIcon', contentStatus })).toBe(
				'DirtyIcon'
			);
		}
	);

	test.each<BoardContentStatus>(['saved', 'pristine'])(
		'returns the standard icon when contentStatus is %s',
		(contentStatus) => {
			expect(getBoardIcon({ icon: 'Icon', dirtyIcon: 'DirtyIcon', contentStatus })).toBe('Icon');
		}
	);

	test('returns the standard icon when there is no contentStatus', () => {
		expect(getBoardIcon({ icon: 'Icon', dirtyIcon: 'DirtyIcon' })).toBe('Icon');
	});

	test('returns the standard icon when pending but no dirty icon is provided', () => {
		expect(getBoardIcon({ icon: 'Icon', contentStatus: 'dirty' })).toBe('Icon');
	});
});
