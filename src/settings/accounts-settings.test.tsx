/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import 'jest-styled-components';
import { faker } from '@faker-js/faker';
import { screen, waitFor, within } from '@testing-library/react';
import { map } from 'lodash';
import { rest } from 'msw';

import { identityToIdentityProps } from './account-wrapper';
import { AccountsSettings } from './accounts-settings';
import { Account, BatchRequest, IdentityProps } from '../../types';
import server, { waitForRequest } from '../mocks/server';
import { setup } from '../test/utils';

jest.mock('../workers');

describe('Account setting', () => {
	test('Show primary identity inside the list', async () => {
		const fullName = faker.person.fullName();
		const email = faker.internet.email();
		const id = faker.string.uuid();

		const identitiesArray = [
			{
				id,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: fullName
				}
			}
		];

		const account: Account = {
			name: email,
			rights: { targets: [] },
			signatures: { signature: [] },
			id,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		setup(
			<AccountsSettings
				account={account}
				identitiesDefault={map(identitiesArray, (item, index) =>
					identityToIdentityProps(item, index)
				)}
			/>
		);
		await screen.findByText('sendAs');
		expect(screen.getByText(fullName)).toBeVisible();
		expect(screen.getByText(`(${email})`)).toBeVisible();
		expect(screen.getByText('Primary')).toBeVisible();
	});

	test('Should show the new identity in the list when clicking on add', async () => {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const fullName = faker.person.fullName({ firstName, lastName });
		const email = faker.internet.email({ firstName, lastName });
		const id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: fullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: firstName
				}
			}
		];

		const account: Account = {
			name: email,
			rights: { targets: [] },
			signatures: { signature: [] },
			id,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const { user } = setup(
			<AccountsSettings
				account={account}
				identitiesDefault={map(identitiesArray, (item, index) =>
					identityToIdentityProps(item, index)
				)}
			/>
		);

		await screen.findByText('sendAs');
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
	});

	test('Should increase the number of the persona when there are already identities with the default name', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');
		expect(screen.getByText('New Persona 1')).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 2')).toBeVisible();
	});

	test('Should not increase the counter if the identities have a name different from the default', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = faker.person.fullName();
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');
		expect(screen.getByText(persona1FullName)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText('New Persona 1')).toBeVisible();
	});

	test('Should remove the identity from the list on delete action', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = faker.person.fullName();
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');
		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row).toBeVisible();
		await user.click(persona1Row);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		const confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		await user.click(confirmButton);
		expect(persona1Row).not.toBeInTheDocument();
	});

	test('Should create only identities which have not been removed from the unsaved changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		server.use(
			rest.post('/service/soap/BatchRequest', (req, res, ctx) =>
				res(
					ctx.json({
						Body: {
							BatchResponse: {
								CreateIdentityResponse: []
							}
						}
					})
				)
			)
		);

		const pendingBatchRequest = waitForRequest('POST', '/service/soap/BatchRequest');

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(
				/new persona 1/i
			)
		);

		const persona1 = 'New Persona 1';
		const persona2 = 'New Persona 2';
		const persona3 = 'New Persona 3';
		expect(screen.getByText(persona1)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona2)
		);
		expect(screen.getByText(persona2)).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona3)
		);
		expect(screen.getByText(persona3)).toBeVisible();

		await user.click(screen.getByText(persona1));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona1)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		let confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona1)).not.toBeInTheDocument();

		await user.click(screen.getByText(persona2));
		await waitFor(() =>
			expect(screen.getByRole('textbox', { name: /persona name/i })).toHaveDisplayValue(persona2)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		confirmButton = await screen.findByRole('button', { name: /delete permanently/i });
		await user.click(confirmButton);
		await screen.findByText(/primary account settings/i);
		expect(screen.queryByText(persona2)).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /save/i }));

		await user.click(screen.getByRole('button', { name: /save/i }));

		const request = await pendingBatchRequest;

		const requestBody = (request?.body as { Body: { BatchRequest: BatchRequest } }).Body;
		expect(requestBody.BatchRequest.CreateIdentityRequest).toHaveLength(1);
		expect(requestBody.BatchRequest.DeleteIdentityRequest).toBeUndefined();
		expect(requestBody.BatchRequest.ModifyIdentityRequest).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar).toBeVisible();
	});

	test('Should remove from the list added identities not saved on discard changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(persona1Row).not.toBeInTheDocument();
	});

	test('Should add in the list removed identities not saved on discard changes', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const persona1FullName = 'New Persona 1';
		const persona1Email = faker.internet.email();
		const persona1Id = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: persona1Id,
				name: persona1FullName,
				_attrs: {
					zimbraPrefIdentityName: persona1FullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: '',
					zimbraPrefFromAddress: persona1Email,
					zimbraPrefIdentityId: persona1Id
				}
			},
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		const persona1Row = screen.getByText('New Persona 1');
		expect(persona1Row).toBeVisible();

		await user.click(persona1Row);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		expect(persona1Row).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(screen.getByText('New Persona 1')).toBeVisible();
	});

	test('Should update name of the identity in the list if the user change it from the input(default case)', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName)
		).toBeVisible();
	});

	test('Should reset the updated identity name on discard changes(default case)', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.type(accountNameInput, newName);

		expect(accountNameInput).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName)
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName)
		).toBeVisible();
		expect(accountNameInput).toHaveDisplayValue(defaultFullName);
	});

	test('Should not allow updating primary account email', async () => {
		const defaultFirstName = faker.person.firstName();
		const defaultLastName = faker.person.lastName();
		const defaultFullName = faker.person.fullName({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultEmail = faker.internet.email({
			firstName: defaultFirstName,
			lastName: defaultLastName
		});
		const defaultId = faker.string.uuid();

		const identitiesArray: Account['identities']['identity'] = [
			{
				id: defaultId,
				name: 'DEFAULT',
				_attrs: {
					zimbraPrefIdentityName: defaultFullName,
					zimbraPrefReplyToEnabled: 'FALSE',
					zimbraPrefFromDisplay: defaultFirstName,
					zimbraPrefFromAddress: defaultEmail,
					zimbraPrefIdentityId: defaultId
				}
			}
		];

		const account: Account = {
			name: defaultEmail,
			rights: { targets: [] },
			signatures: { signature: [] },
			id: defaultId,
			displayName: '',
			identities: {
				identity: identitiesArray
			}
		};

		const identitiesDefault = map(identitiesArray, (item, index) =>
			identityToIdentityProps(item, index)
		);

		identitiesDefault.unshift(identitiesDefault.pop() as IdentityProps);

		const { user } = setup(
			<AccountsSettings account={account} identitiesDefault={identitiesDefault} />
		);
		await screen.findByText('sendAs');

		const emailAddressInput = screen.getByRole('textbox', { name: /E-mail address/i });
		expect(emailAddressInput).toHaveDisplayValue(defaultEmail);

		const newMail = 'acb';
		await user.clear(emailAddressInput);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

		await user.type(emailAddressInput, newMail);

		expect(screen.getByRole('button', { name: /discard changes/i })).toBeDisabled();
		expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();

		expect(emailAddressInput).toHaveDisplayValue(defaultEmail);
	});
});
