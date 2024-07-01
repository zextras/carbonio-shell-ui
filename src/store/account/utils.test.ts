/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useAccountStore } from './store';
import { mergeAttrs, mergePrefs, mergeProps } from './utils';

const zimlet = 'carbonio-ui';

beforeEach(() => {
	useAccountStore.setState(() => ({
		authenticated: false,
		account: undefined,
		version: '',
		settings: {
			prefs: {},
			attrs: {},
			props: []
		},
		usedQuota: 0,
		lastNotificationTime: Date.now()
	}));
});

describe('utils', () => {
	describe('mergeAttrs', () => {
		test('given an empty state and a single attr mod, the store will contain the single attr', async () => {
			const state = useAccountStore.getState();
			const attrs = { newAttr: 'new attr value' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(updatedAttrs).toEqual({ newAttr: 'new attr value' });
		});

		test('given an empty state and multiple attrs mods, the store will contain the multiple attrs', async () => {
			const state = useAccountStore.getState();
			const attrs = { newAttr1: 'attr1', newAttr2: 'attr2' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(updatedAttrs).toEqual(
				expect.objectContaining({
					newAttr1: 'attr1',
					newAttr2: 'attr2'
				})
			);
		});

		test('given a prefilled state and a single attr mod, the store will contain both', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					attrs: { oldAttr: 'old' }
				}
			}));

			const state = useAccountStore.getState();
			const attrs = { newAttr: 'new' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(updatedAttrs).toEqual(
				expect.objectContaining({
					oldAttr: 'old',
					newAttr: 'new'
				})
			);
		});

		test('given a prefilled state and multiple attrs mods, the store will contain all of them', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					attrs: { oldAttr1: 'old1', oldAttr2: 'old2' }
				}
			}));

			const state = useAccountStore.getState();
			const attrs = { newAttr1: 'new1', newAttr2: 'new2' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(updatedAttrs).toEqual(
				expect.objectContaining({
					newAttr1: 'new1',
					newAttr2: 'new2',
					oldAttr1: 'old1',
					oldAttr2: 'old2'
				})
			);
		});

		test('given a prefilled state and a single mod for an existing attr, the new attr value will replace the old one', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					attrs: { oldAttr: 'old' }
				}
			}));

			const state = useAccountStore.getState();
			const attrs = { oldAttr: 'new' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(updatedAttrs).toEqual(
				expect.objectContaining({
					oldAttr: 'new'
				})
			);
		});
	});

	describe('mergePrefs', () => {
		test('given an empty state and a single pref mod, the store will contain the single pref', async () => {
			const state = useAccountStore.getState();
			const prefs = {
				newPref: 'dateAsc'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(updatedPrefs).toEqual({ newPref: 'dateAsc' });
		});

		test('given an empty state and multiple prefs mods, the store will contain the multiple prefs', async () => {
			const state = useAccountStore.getState();
			const prefs = {
				newPref1: 'dateAsc',
				newPref2: 'UTC'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(updatedPrefs).toEqual(
				expect.objectContaining({
					newPref1: 'dateAsc',
					newPref2: 'UTC'
				})
			);
		});

		test('given a prefilled state and a single pref mod, the store will contain both', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { oldPref: 'UTC' }
				}
			}));

			const state = useAccountStore.getState();
			const prefs = {
				newPref: 'dateAsc'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(updatedPrefs).toEqual(
				expect.objectContaining({
					oldPref: 'UTC',
					newPref: 'dateAsc'
				})
			);
		});

		test('given a prefilled state and multiple prefs mods, the store will contain all of them', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { oldPref1: 'en', oldPref2: 'message' }
				}
			}));

			const state = useAccountStore.getState();
			const prefs = {
				newPref1: 'UTC',
				newPref2: 'dateAsc'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(updatedPrefs).toEqual(
				expect.objectContaining({
					newPref1: 'UTC',
					newPref2: 'dateAsc',
					oldPref1: 'en',
					oldPref2: 'message'
				})
			);
		});

		test('given a prefilled state and a single mod for an existing pref, the new pref value will replace the old one', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					prefs: { oldPref: 'old' }
				}
			}));

			const state = useAccountStore.getState();
			const prefs = {
				oldPref: 'new'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(updatedPrefs).toEqual(
				expect.objectContaining({
					oldPref: 'new'
				})
			);
		});
	});

	describe('mergeProps', () => {
		test('given an empty state and a single prop mod, the store will contain the single prop', async () => {
			const state = useAccountStore.getState();
			const props = {
				newProp: { app: zimlet, value: 'enabled' }
			};

			const updatedProps = mergeProps(props, state);
			expect(updatedProps).toEqual([{ name: 'newProp', zimlet, _content: 'enabled' }]);
		});

		test('given an empty state and multiple props mods, the store will contain the multiple props', async () => {
			const state = useAccountStore.getState();
			const props = {
				newProp1: { app: zimlet, value: 'enabled' },
				newProp2: { app: zimlet, value: '5' }
			};

			const updatedProps = mergeProps(props, state);
			expect(updatedProps).toEqual(
				expect.arrayContaining([
					{ name: 'newProp1', zimlet, _content: 'enabled' },
					{ name: 'newProp2', zimlet, _content: '5' }
				])
			);
		});

		test('given a prefilled state and a single prop mod, the store will contain both', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					props: [
						{ zimlet, name: 'oldProp1', _content: 'auto' },
						{ zimlet, name: 'oldProp2', _content: 'false' }
					]
				}
			}));

			const state = useAccountStore.getState();
			const props = { newProp1: { app: zimlet, value: 'TRUE' } };

			const updatedProps = mergeProps(props, state);
			expect(updatedProps).toEqual(
				expect.arrayContaining([
					{ name: 'oldProp1', zimlet, _content: 'auto' },
					{ name: 'oldProp2', zimlet, _content: 'false' },
					{ name: 'newProp1', zimlet, _content: 'TRUE' }
				])
			);
		});

		test('given a prefilled state and multiple props mods, the store will contain all of them', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					props: [
						{ zimlet, name: 'oldProp1', _content: 'auto' },
						{ zimlet, name: 'oldProp2', _content: 'false' }
					]
				}
			}));

			const state = useAccountStore.getState();
			const props = {
				newProp1: { app: zimlet, value: 'TRUE' },
				newProp2: { app: zimlet, value: '5' }
			};

			const updatedPrefs = mergeProps(props, state);
			expect(updatedPrefs).toEqual(
				expect.arrayContaining([
					{ name: 'oldProp1', zimlet, _content: 'auto' },
					{ name: 'oldProp2', zimlet, _content: 'false' },
					{ name: 'newProp1', zimlet, _content: 'TRUE' },
					{ name: 'newProp2', zimlet, _content: '5' }
				])
			);
		});

		test('given a prefilled state and a single mod for an existing prop, the new prop value will replace the old one', async () => {
			useAccountStore.setState((previousState) => ({
				...previousState,
				settings: {
					...previousState.settings,
					props: [{ name: 'oldProp', zimlet, _content: 'true' }]
				}
			}));

			const state = useAccountStore.getState();
			const props = {
				oldProp: { app: zimlet, value: 'false' }
			};

			const updatedProps = mergeProps(props, state);
			expect(updatedProps).toEqual(
				expect.arrayContaining([
					{
						name: 'oldProp',
						zimlet,
						_content: 'false'
					}
				])
			);
		});
	});
});
