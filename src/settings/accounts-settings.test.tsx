/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import { screen, waitFor, within } from '@testing-library/react';
import { shuffle } from 'lodash';
import { http, HttpResponse } from 'msw';

import { AccountsSettings } from './accounts-settings';
import { JSNS } from '../constants';
import server, { waitForRequest } from '../mocks/server';
import { createAccount, createIdentity, setupAccountStore } from '../tests/account-utils';
import { controlConsoleError, setup } from '../tests/utils';
import type { BatchRequest, CreateIdentityResponse } from '../types/network';

// Returns the order of the rendered account list using each item's data-testid
// (`account-list-item-${zimbraPrefIdentityId}`), so assertions are decoupled
// from the rendered copy and DOM structure.
function getAccountListOrder(): Array<string> {
	return screen.getAllByRole('listitem').map((item) => item.getAttribute('data-testid') ?? '');
}

describe('Account setting', () => {
	const defaultFirstName = faker.person.firstName();
	const defaultLastName = faker.person.lastName();
	const defaultFullName = faker.person.fullName({
		firstName: defaultFirstName,
		lastName: defaultLastName
	});
	const defaultEmail = 'default@email.com';
	const defaultId = faker.string.uuid();

	const persona1FullName = 'New Persona 1';
	const persona1Email = 'persona1@email.com';
	const persona1Id = faker.string.uuid();

	const persona2FullName = 'New Persona 2';
	const persona2Email = 'persona2@email.com';
	const persona2Id = faker.string.uuid();

	const persona3FullName = 'New Persona 3';
	const persona3Email = 'persona3@email.com';
	const persona3Id = faker.string.uuid();

	test('When saving the order should not change', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: 'defaultFullName',
						zimbraPrefFromAddress: 'default@email.com'
					},
					true
				)
			])
		});
		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							CreateIdentityResponse: [
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona1Id,
												zimbraPrefIdentityName: persona1FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								},
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona2Id,
												zimbraPrefIdentityName: persona2FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								},
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona3Id,
												zimbraPrefIdentityName: persona3FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								}
							] as CreateIdentityResponse[]
						}
					}
				})
			)
		);

		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the first added persona should get the default name'
			).toHaveDisplayValue(persona1FullName)
		);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the second added persona should get the next default name'
			).toHaveDisplayValue(persona2FullName)
		);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the third added persona should get the next default name'
			).toHaveDisplayValue(persona3FullName)
		);

		// Before save: new personas hold synthetic incremental ids ('0', '1', '2').
		expect(
			getAccountListOrder(),
			'before save the new personas should keep their synthetic incremental ids in order'
		).toEqual([
			`account-list-item-${defaultId}`,
			'account-list-item-0',
			'account-list-item-1',
			'account-list-item-2'
		]);

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);
		expect(
			requestBody.BatchRequest.CreateIdentityRequest,
			'the batch request should create the three new personas'
		).toHaveLength(3);
		expect(
			requestBody.BatchRequest.DeleteIdentityRequest,
			'the batch request should not delete any identity'
		).toBeUndefined();
		expect(
			requestBody.BatchRequest.ModifyIdentityRequest,
			'the batch request should not modify any identity'
		).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar, 'the success snackbar should be shown after saving').toBeVisible();
		// After save the server-returned ids replace the synthetic ones, preserving order.
		expect(
			getAccountListOrder(),
			'after save the server-returned ids should replace the synthetic ones preserving order'
		).toEqual([
			`account-list-item-${defaultId}`,
			`account-list-item-${persona1Id}`,
			`account-list-item-${persona2Id}`,
			`account-list-item-${persona3Id}`
		]);
	});

	test('When discarding the order should be the same of the initial one', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: 'defaultFullName',
						zimbraPrefFromAddress: 'default@email.com'
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				)
			])
		});

		const expectedOrder = [`account-list-item-${defaultId}`, `account-list-item-${persona1Id}`];
		const { user } = setup(<AccountsSettings />);

		expect(getAccountListOrder(), 'the initial list order should match the expected one').toEqual(
			expectedOrder
		);

		await user.click(screen.getByText(persona1FullName));
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			screen.getByText(persona1FullName),
			'the deleted persona should reappear after discarding changes'
		).toBeVisible();
		expect(
			getAccountListOrder(),
			'discarding changes should restore the initial list order'
		).toEqual(expectedOrder);
	});

	test('Check that the default is always the first item', async () => {
		setupAccountStore({
			account: createAccount(
				defaultEmail,
				defaultId,
				shuffle([
					createIdentity(
						{
							zimbraPrefIdentityId: persona3Id,
							zimbraPrefIdentityName: persona3FullName,
							zimbraPrefFromAddress: persona3Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: persona2Id,
							zimbraPrefIdentityName: persona2FullName,
							zimbraPrefFromAddress: persona2Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: persona1Id,
							zimbraPrefIdentityName: persona1FullName,
							zimbraPrefFromAddress: persona1Email
						},
						false
					),
					createIdentity(
						{
							zimbraPrefIdentityId: defaultId,
							zimbraPrefIdentityName: 'defaultFullName',
							zimbraPrefFromAddress: 'default@email.com'
						},
						true
					)
				])
			)
		});

		setup(<AccountsSettings />);

		const order = getAccountListOrder();
		expect(order, 'the list should contain all four identities').toHaveLength(4);
		expect(order[0], 'the default identity should always be the first item').toBe(
			`account-list-item-${defaultId}`
		);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(/primary/i),
			'the default identity should be marked as primary'
		).toBeVisible();
	});

	test('When adding an item it is always placed as last', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);
		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const order = getAccountListOrder();
		expect(order, 'the list should contain the default and the newly added persona').toHaveLength(
			2
		);
		expect(order[order.length - 1], 'the added persona should be placed as the last item').toBe(
			'account-list-item-0'
		);
		expect(
			within(screen.getByTestId('account-list-item-0')).getByText(persona1FullName),
			'the added persona should show the default name'
		).toBeVisible();
	});

	test('Show primary identity inside the list', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail
					},
					true
				)
			])
		});

		setup(<AccountsSettings />);

		expect(
			screen.getByText(defaultFullName),
			'the primary identity name should be visible in the list'
		).toBeVisible();
		expect(
			screen.getByText(`(${defaultEmail})`),
			'the primary identity email should be visible in the list'
		).toBeVisible();
		expect(
			screen.getByText('Primary'),
			'the primary identity badge should be visible'
		).toBeVisible();
	});

	test('Should show the new identity in the list when clicking on add', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getByText(persona1FullName),
			'the new persona should appear in the list after clicking add'
		).toBeVisible();
	});

	test('Should increase the number of the persona when there are already identities with the default name', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);
		expect(
			screen.getByText(persona1FullName),
			'the existing persona with the default name should be visible'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getByText(persona2FullName),
			'the new persona name counter should be incremented past the existing default name'
		).toBeVisible();
	});

	test('When existing persona identityName is updated but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the existing persona row should be visible').toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(
			accountNameInput,
			'the name input should show the selected persona name'
		).toHaveDisplayValue(persona1FullName);

		expect(
			within(screen.getByTestId(`account-list-item-${persona1Id}`)).getByText(persona1FullName),
			'the list item should still show the original persona name'
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		expect(accountNameInput, 'the name input should reflect the typed new name').toHaveDisplayValue(
			newName
		);
		expect(
			within(screen.getByTestId(`account-list-item-${persona1Id}`)).getByText(newName),
			'the list item should update to the new name even before saving'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona2FullName),
			'the new persona should use the next default name, not the unsaved old name'
		).toBeVisible();
	});

	test('When create a new persona and modify the proposed identityName before saving and than create another persona the proposed identityName should be the same', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the newly created persona row should be visible').toBeVisible();
		await user.click(persona1Row);

		const accountNameInput = screen.getByRole('textbox', { name: /persona name/i });
		expect(
			accountNameInput,
			'the name input should show the proposed persona name'
		).toHaveDisplayValue(persona1FullName);

		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona1FullName),
			'the list item should show the proposed persona name'
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		expect(accountNameInput, 'the name input should reflect the typed new name').toHaveDisplayValue(
			newName
		);
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(newName),
			'the list item should update to the new name even before saving'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getByText(persona1FullName),
			'the next new persona should keep the same default proposed name'
		).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText(persona1FullName),
			'the second new persona should reuse the default proposed name'
		).toBeVisible();
		expect(
			screen.queryByText(persona2FullName),
			'the counter should not increment because the renamed persona no longer uses the default name'
		).not.toBeInTheDocument();
	});

	test('When existing persona is deleted but not yet saved, the old (but current) identityName should not be used as default one for a new persona', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});
		const { user } = setup(<AccountsSettings />);

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the existing persona row should be visible').toBeVisible();
		await user.click(persona1Row);

		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		expect(persona1Row, 'the persona row should be removed after deletion').not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			within(screen.getByTestId(`account-list-item-0`)).getByText(persona2FullName),
			'the new persona should use the incremented default name, ignoring the deleted unsaved persona name'
		).toBeVisible();
	});

	test('When create a new persona and delete it before saving and then create another persona the proposed identityName should be the same', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByRole('button', { name: /add persona/i }));

		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the newly created persona row should be visible').toBeVisible();
		await user.click(persona1Row);

		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		expect(persona1Row, 'the persona row should be removed after deletion').not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getByText(persona1FullName),
			'the next new persona should reuse the same default proposed name after the deletion'
		).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-1`)).getByText(persona1FullName),
			'the second new persona should use the default proposed name'
		).toBeVisible();
		expect(
			screen.queryByText(persona2FullName),
			'the counter should not increment because the deleted persona freed the default name'
		).not.toBeInTheDocument();
	});

	test('Should not increase the counter if the identities have a name different from the default', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});
		const { user } = setup(<AccountsSettings />);
		expect(
			screen.getByText(persona1FullName),
			'the existing custom-named persona should be visible'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getByText(persona1FullName),
			'the counter should stay at 1 because no identity uses the default name'
		).toBeVisible();
	});

	test('Should remove the identity from the list on delete action', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);
		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the persona row should be visible before deletion').toBeVisible();
		await user.click(persona1Row);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		expect(
			persona1Row,
			'the persona row should be removed from the list after the delete action'
		).not.toBeInTheDocument();
	});

	test('Should create only identities which have not been removed from the unsaved changes', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							CreateIdentityResponse: [
								{
									identity: [
										createIdentity(
											{
												zimbraPrefIdentityId: persona3Id,
												zimbraPrefIdentityName: persona3FullName,
												zimbraPrefFromAddress: defaultEmail
											},
											false
										)
									]
								}
							]
						}
					}
				})
			)
		);

		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the first added persona should get the default name'
			).toHaveDisplayValue(persona1FullName)
		);

		expect(
			screen.getByText(persona1FullName),
			'the first added persona should be visible'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the second added persona should get the next default name'
			).toHaveDisplayValue(persona2FullName)
		);
		expect(
			screen.getByText(persona2FullName),
			'the second added persona should be visible'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'the third added persona should get the next default name'
			).toHaveDisplayValue(persona3FullName)
		);
		expect(
			screen.getByText(persona3FullName),
			'the third added persona should be visible'
		).toBeVisible();

		await user.click(screen.getByText(persona1FullName));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'selecting the first persona should load its name in the input'
			).toHaveDisplayValue(persona1FullName)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		await screen.findByText(/primary account settings/i);
		expect(
			screen.queryByText(persona1FullName),
			'the first persona should be removed from the unsaved list'
		).not.toBeInTheDocument();

		await user.click(screen.getByText(persona2FullName));
		await waitFor(() =>
			expect(
				screen.getByRole('textbox', { name: /persona name/i }),
				'selecting the second persona should load its name in the input'
			).toHaveDisplayValue(persona2FullName)
		);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		await screen.findByText(/primary account settings/i);
		expect(
			screen.queryByText(persona2FullName),
			'the second persona should be removed from the unsaved list'
		).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);

		expect(
			requestBody.BatchRequest.CreateIdentityRequest,
			'only the one persona not removed before saving should be created'
		).toHaveLength(1);
		expect(
			requestBody.BatchRequest.DeleteIdentityRequest,
			'no delete request should be sent for personas that were never saved'
		).toBeUndefined();
		expect(
			requestBody.BatchRequest.ModifyIdentityRequest,
			'no modify request should be sent'
		).toBeUndefined();

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar, 'the success snackbar should be shown after saving').toBeVisible();
	});

	test('Should remove from the list added identities not saved on discard changes', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(screen.getByText(persona1FullName), 'the added persona should be visible').toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));
		expect(
			screen.queryByText(persona1FullName),
			'discarding changes should remove the unsaved added persona'
		).not.toBeInTheDocument();
	});

	test('Should add in the list removed identities not saved on discard changes', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const { user } = setup(<AccountsSettings />);

		expect(
			screen.getByText(persona1FullName),
			'the existing persona should be visible initially'
		).toBeVisible();

		await user.click(screen.getByText(persona1FullName));
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		expect(
			screen.queryByText(persona1FullName),
			'the persona should be removed from the unsaved list after deletion'
		).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			screen.getByText(persona1FullName),
			'discarding changes should restore the unsaved deleted persona'
		).toBeVisible();
	});

	test('Should update name of the identity in the list if the user change it from the input(default case)', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});
		const { user } = setup(<AccountsSettings />);

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(
			accountNameInput,
			'the account name input should show the default identity name'
		).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName),
			'the list item should initially show the default identity name'
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		expect(
			accountNameInput,
			'the account name input should reflect the typed new name'
		).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName),
			'the list item should update to the new name as the user types'
		).toBeVisible();
	});

	test('When modify an identity, should populate a ModifyIdentityRequest', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							ModifyIdentityResponse: [{ _jsns: JSNS.account }]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);
		const { user } = setup(<AccountsSettings />);

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		await user.click(screen.getByRole('button', { name: /save/i }));

		const { Body: requestBody } = await pendingBatchRequest.then(
			(req) => req.json() as Promise<{ Body: { BatchRequest: BatchRequest } }>
		);
		expect(
			requestBody.BatchRequest.CreateIdentityRequest,
			'modifying an identity should not create any identity'
		).toBeUndefined();
		expect(
			requestBody.BatchRequest.DeleteIdentityRequest,
			'modifying an identity should not delete any identity'
		).toBeUndefined();
		expect(
			requestBody.BatchRequest.ModifyIdentityRequest,
			'modifying an identity should populate a single ModifyIdentityRequest'
		).toHaveLength(1);

		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar, 'the success snackbar should be shown after saving').toBeVisible();
	});

	test('When modify an identity, the new value must be shown after save', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							ModifyIdentityResponse: [
								{ _jsns: JSNS.account, requestId: `modifyIdentity-${defaultId}` }
							]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);
		const { user } = setup(<AccountsSettings />);

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		await user.click(screen.getByRole('button', { name: /save/i }));

		await pendingBatchRequest;
		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar, 'the success snackbar should be shown after saving').toBeVisible();

		expect(
			accountNameInput,
			'the account name input should keep showing the new value after saving'
		).toHaveDisplayValue(newName);
	});

	test('When delete an identity, it must not be present after save', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		server.use(
			http.post('/service/soap/BatchRequest', () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							DeleteIdentityResponse: [
								{ _jsns: JSNS.account, requestId: `deleteIdentity-${persona1Id}` }
							]
						}
					}
				})
			)
		);

		const batchRequestUrl = '/service/soap/BatchRequest';
		const pendingBatchRequest = waitForRequest('POST', batchRequestUrl);

		const { user } = setup(<AccountsSettings />);
		const persona1Row = screen.getByText(persona1FullName);
		expect(persona1Row, 'the persona row should be visible before deletion').toBeVisible();
		await user.click(persona1Row);
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));

		await user.click(screen.getByRole('button', { name: /save/i }));

		await pendingBatchRequest;
		const successSnackbar = await screen.findByText('Edits saved correctly');
		expect(successSnackbar, 'the success snackbar should be shown after saving').toBeVisible();

		expect(
			screen.queryByText(persona1FullName),
			'the deleted persona should no longer be present after saving'
		).not.toBeInTheDocument();
	});

	test('Should reset the updated identity name on discard changes(default case)', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});
		const { user } = setup(<AccountsSettings />);

		const accountNameInput = screen.getByRole('textbox', { name: /account name/i });
		expect(
			accountNameInput,
			'the account name input should show the default identity name'
		).toHaveDisplayValue(defaultFullName);

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName),
			'the list item should initially show the default identity name'
		).toBeVisible();

		const newName = 'Updated Name';
		await user.clear(accountNameInput);
		await user.paste(newName);

		expect(
			accountNameInput,
			'the account name input should reflect the typed new name'
		).toHaveDisplayValue(newName);
		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(newName),
			'the list item should update to the new name before discarding'
		).toBeVisible();

		await user.click(screen.getByRole('button', { name: /discard changes/i }));

		expect(
			within(screen.getByTestId(`account-list-item-${defaultId}`)).getByText(defaultFullName),
			'discarding changes should restore the original name in the list item'
		).toBeVisible();
		expect(
			accountNameInput,
			'discarding changes should restore the original name in the input'
		).toHaveDisplayValue(defaultFullName);
	});

	test('Should not allow updating primary account email', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});
		const { user } = setup(<AccountsSettings />);

		const emailAddressInput = screen.getByRole('textbox', { name: /E-mail address/i });
		expect(
			emailAddressInput,
			'the email input should show the primary account email'
		).toHaveDisplayValue(defaultEmail);

		const newMail = 'acb';
		await user.clear(emailAddressInput);

		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should stay disabled after clearing the read-only email'
		).toBeDisabled();
		expect(
			screen.getByRole('button', { name: /save/i }),
			'the save button should stay disabled after clearing the read-only email'
		).toBeDisabled();

		await user.paste(newMail);

		expect(
			screen.getByRole('button', { name: /discard changes/i }),
			'the discard button should stay disabled after typing in the read-only email'
		).toBeDisabled();
		expect(
			screen.getByRole('button', { name: /save/i }),
			'the save button should stay disabled after typing in the read-only email'
		).toBeDisabled();

		expect(
			emailAddressInput,
			'the primary account email should remain unchanged'
		).toHaveDisplayValue(defaultEmail);
	});

	it('should render the error snackbar when the user tries to create a new identity with the name already existing', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				)
			])
		});

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							Fault: [{}]
						}
					}
				})
			)
		);

		const { user } = setup(<AccountsSettings />);
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		expect(
			screen.getAllByRole('listitem').length,
			'the list should contain three items after adding a persona'
		).toEqual(3);
		const inputElement = screen.getByRole('textbox', { name: /persona name/i });
		await user.clear(inputElement);
		await user.paste(persona1FullName);
		await user.click(screen.getByRole('button', { name: /save/i }));
		const snackbar = await screen.findByText(/something went wrong, please try again/i);
		expect(snackbar, 'an error snackbar should appear when the create request fails').toBeVisible();
		expect(
			screen.getAllByRole('listitem').length,
			'the list should be restored to two items after the failed creation'
		).toEqual(2);
	});

	it('should render the error snackbar when the user tries to modify an identity with a name already existing', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona2Id,
						zimbraPrefIdentityName: persona2FullName,
						zimbraPrefFromAddress: persona2Email
					},
					false
				)
			])
		});

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							Fault: [{}]
						}
					}
				})
			)
		);

		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByText(persona2FullName));
		const inputElement = screen.getByRole('textbox', { name: /persona name/i });
		await user.clear(inputElement);
		await user.paste(persona1FullName);
		expect(
			within(screen.getByTestId(`account-list-item-${persona2Id}`)).getByText(persona1FullName),
			'the list item should show the conflicting new name before saving'
		).toBeVisible();
		await user.click(screen.getByRole('button', { name: /save/i }));
		const successSnackbar = await screen.findByText(/something went wrong, please try again/i);
		expect(
			successSnackbar,
			'an error snackbar should appear when the modify request fails'
		).toBeVisible();
		expect(
			within(screen.getByTestId(`account-list-item-${persona2Id}`)).getByText(persona2FullName),
			'the persona name should be restored to its original value after the failed modification'
		).toBeVisible();
	});

	it('should render an error snackbar when the total identities created is more than the zimbraIdentityMaxNumEntries value set', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				)
			]),
			accountSettingsAttrs: { zimbraIdentityMaxNumEntries: 2 }
		});

		const { user } = setup(<AccountsSettings />);

		expect(
			screen.getByText(persona1FullName),
			'the existing persona should be visible'
		).toBeVisible();
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await user.click(screen.getByRole('button', { name: /save/i }));

		const successSnackbar = await screen.findByText(
			/the identity could not be created because you have exceeded your identity quota/i
		);
		expect(
			successSnackbar,
			'an identity quota error snackbar should appear when exceeding zimbraIdentityMaxNumEntries'
		).toBeVisible();
	});

	it('should render an error snackbar and restore the state to the previous one when the user tries to delete an identity and the request fails', async () => {
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				),
				createIdentity(
					{
						zimbraPrefIdentityId: persona1Id,
						zimbraPrefIdentityName: persona1FullName,
						zimbraPrefFromAddress: persona1Email
					},
					false
				)
			])
		});

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						BatchResponse: {
							Fault: [{}]
						}
					}
				})
			)
		);
		const { user } = setup(<AccountsSettings />);

		await user.click(screen.getByText(persona1FullName));
		await user.click(screen.getByRole('button', { name: /delete/i }));
		await user.click(await screen.findByRole('button', { name: /delete permanently/i }));
		expect(
			screen.getAllByRole('listitem').length,
			'the list should show one item after the local deletion'
		).toEqual(1);
		await user.click(screen.getByRole('button', { name: /save/i }));
		const snackbar = await screen.findByText(/something went wrong, please try again/i);
		expect(snackbar, 'an error snackbar should appear when the delete request fails').toBeVisible();
		expect(
			screen.getAllByRole('listitem').length,
			'the deleted identity should be restored to the list after the failed delete'
		).toEqual(2);
	});

	it('should render an error when the response is a RawErrorSoapResponse', async () => {
		controlConsoleError('ERROR_CODE: REASON_TEXT');
		setupAccountStore({
			account: createAccount(defaultEmail, defaultId, [
				createIdentity(
					{
						zimbraPrefIdentityId: defaultId,
						zimbraPrefIdentityName: defaultFullName,
						zimbraPrefFromAddress: defaultEmail,
						zimbraPrefFromDisplay: defaultFirstName
					},
					true
				)
			])
		});

		const batchRequestUrl = '/service/soap/BatchRequest';
		server.use(
			http.post(batchRequestUrl, () =>
				HttpResponse.json({
					Body: {
						Fault: {
							Code: { value: '' },
							Detail: {
								Error: {
									Code: 'ERROR_CODE',
									Trace: ''
								}
							},
							Reason: {
								Text: 'REASON_TEXT'
							}
						}
					}
				})
			)
		);
		const { user } = setup(<AccountsSettings />);
		await user.click(screen.getByRole('button', { name: /add persona/i }));
		await user.click(screen.getByRole('button', { name: /save/i }));
		const snackbar = await screen.findByText(/something went wrong, please try again/i);
		expect(
			snackbar,
			'an error snackbar should appear when the response is a RawErrorSoapResponse'
		).toBeVisible();
	});
});
