/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { find } from 'lodash';

import { useAccountStore } from './store';
import { mergeAttrs, mergePrefs, mergeProps, updateIdentities } from './utils';
import { setupAccountStore } from '../../tests/account-utils';
import type { Identity } from '../../types/account';
import type { IdentityMods } from '../../types/network';

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
		lastNotificationTime: Date.now()
	}));
});

describe('utils', () => {
	describe('mergeAttrs', () => {
		test('given an empty state and a single attr mod, the store will contain the single attr', async () => {
			const state = useAccountStore.getState();
			const attrs = { newAttr: 'new attr value' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(
				updatedAttrs,
				'merged attrs should contain the single new attr when starting from an empty state'
			).toEqual({ newAttr: 'new attr value' });
		});

		test('given an empty state and multiple attrs mods, the store will contain the multiple attrs', async () => {
			const state = useAccountStore.getState();
			const attrs = { newAttr1: 'attr1', newAttr2: 'attr2' };

			const updatedAttrs = mergeAttrs(attrs, state);
			expect(
				updatedAttrs,
				'merged attrs should contain all the new attrs when starting from an empty state'
			).toEqual(
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
			expect(
				updatedAttrs,
				'merged attrs should contain both the existing and the new attr'
			).toEqual(
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
			expect(
				updatedAttrs,
				'merged attrs should contain all the existing and the new attrs'
			).toEqual(
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
			expect(
				updatedAttrs,
				'merged attrs should replace the existing attr value with the new one'
			).toEqual(
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
			expect(
				updatedPrefs,
				'merged prefs should contain the single new pref when starting from an empty state'
			).toEqual({ newPref: 'dateAsc' });
		});

		test('given an empty state and multiple prefs mods, the store will contain the multiple prefs', async () => {
			const state = useAccountStore.getState();
			const prefs = {
				newPref1: 'dateAsc',
				newPref2: 'UTC'
			};

			const updatedPrefs = mergePrefs(prefs, state);
			expect(
				updatedPrefs,
				'merged prefs should contain all the new prefs when starting from an empty state'
			).toEqual(
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
			expect(
				updatedPrefs,
				'merged prefs should contain both the existing and the new pref'
			).toEqual(
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
			expect(
				updatedPrefs,
				'merged prefs should contain all the existing and the new prefs'
			).toEqual(
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
			expect(
				updatedPrefs,
				'merged prefs should replace the existing pref value with the new one'
			).toEqual(
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
			expect(
				updatedProps,
				'merged props should contain the single new prop when starting from an empty state'
			).toEqual([{ name: 'newProp', zimlet, _content: 'enabled' }]);
		});

		test('given an empty state and multiple props mods, the store will contain the multiple props', async () => {
			const state = useAccountStore.getState();
			const props = {
				newProp1: { app: zimlet, value: 'enabled' },
				newProp2: { app: zimlet, value: '5' }
			};

			const updatedProps = mergeProps(props, state);
			expect(
				updatedProps,
				'merged props should contain all the new props when starting from an empty state'
			).toEqual(
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
			expect(
				updatedProps,
				'merged props should contain both the existing props and the new one'
			).toEqual(
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
			expect(
				updatedPrefs,
				'merged props should contain all the existing props and the new ones'
			).toEqual(
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
			expect(
				updatedProps,
				'merged props should replace the existing prop value with the new one'
			).toEqual(
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

	describe('updateIdentities', () => {
		it('should return undefined if the account field in the state is undefined', () => {
			setupAccountStore();
			useAccountStore.setState((state) => ({
				...state,
				account: undefined
			}));
			const state = useAccountStore.getState();

			expect(
				updateIdentities(state, {}, []),
				'updateIdentities should return undefined when the account in the state is undefined'
			).toEqual(undefined);
		});

		it('should return the original identities if no mods are passed', () => {
			setupAccountStore();
			const state = useAccountStore.getState();
			expect(
				updateIdentities(state, {}, []),
				'updateIdentities should return the original identities when no mods are passed'
			).toEqual(state.account?.identities.identity);
		});

		it('should return the original identities and the new identities', () => {
			setupAccountStore();
			const state = useAccountStore.getState();
			const newIdentity: Identity = {
				_attrs: {},
				id: faker.string.uuid()
			};
			expect(
				updateIdentities(state, {}, [newIdentity]),
				'updateIdentities should prepend the new identity to the original ones'
			).toEqual([newIdentity, ...(state.account?.identities.identity ?? [])]);
		});

		it('should return the original identities without the one which has to be deleted', () => {
			setupAccountStore();
			const state = useAccountStore.getState();
			const identityToDeleteId = state.account?.identities.identity[0].id;
			if (!identityToDeleteId) {
				throw new Error('Identity not found');
			}

			const mods: IdentityMods = {
				deleteList: [identityToDeleteId]
			};
			expect(
				updateIdentities(state, mods, []),
				'updateIdentities should remove the identity listed in the deleteList'
			).not.toContain(expect.objectContaining({ id: identityToDeleteId }));
		});

		it('should return the original identities with updated pref', () => {
			setupAccountStore();
			const state = useAccountStore.getState();
			const identityToUpdateId = state.account?.identities.identity[0].id;
			if (!identityToUpdateId) {
				throw new Error('Identity not found');
			}

			const signatureId = faker.string.uuid();

			const mods: IdentityMods = {
				modifyList: {
					[identityToUpdateId]: {
						id: identityToUpdateId,
						prefs: {
							zimbraPrefDefaultSignatureId: signatureId
						}
					}
				}
			};

			expect(
				updateIdentities(state, mods, [])?.[0]._attrs.zimbraPrefDefaultSignatureId,
				'updateIdentities should apply the modified default signature id to the identity'
			).toEqual(signatureId);
		});

		it('should not change the name of the primary identity', () => {
			setupAccountStore();
			const state = useAccountStore.getState();
			const identityToUpdateId = state.account?.identities.identity[0].id;
			if (!identityToUpdateId) {
				throw new Error('Identity not found');
			}

			const identityNewName = faker.person.fullName();

			const mods: IdentityMods = {
				modifyList: {
					[identityToUpdateId]: {
						id: identityToUpdateId,
						prefs: {
							zimbraPrefIdentityName: identityNewName
						}
					}
				}
			};

			expect(
				updateIdentities(state, mods, [])?.[0].name,
				'updateIdentities should keep the primary identity name as DEFAULT despite the rename mod'
			).toEqual('DEFAULT');
		});

		it('should change the name of the non-primary identity', () => {
			setupAccountStore();

			const identityToUpdateId = faker.string.uuid();
			useAccountStore.setState((state) => ({
				...state,
				...(state.account
					? {
							account: {
								...state.account,
								identities: {
									identity: [
										...(state.account?.identities.identity ?? []),
										{
											id: identityToUpdateId,
											_attrs: {},
											name: faker.person.fullName()
										}
									]
								}
							}
						}
					: {})
			}));
			const state = useAccountStore.getState();

			const identityNewName = faker.person.fullName();
			const mods: IdentityMods = {
				modifyList: {
					[identityToUpdateId]: {
						id: identityToUpdateId,
						prefs: {
							zimbraPrefIdentityName: identityNewName
						}
					}
				}
			};

			const result = updateIdentities(state, mods, []);
			const updatedIdentity = find(result, (identity) => identity.id === identityToUpdateId);
			expect(
				updatedIdentity?.name,
				'updateIdentities should apply the new name to a non-primary identity'
			).toEqual(identityNewName);
		});
	});
});
