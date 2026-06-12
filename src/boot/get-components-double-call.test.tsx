/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Suspense } from 'react';

import { act, render, waitFor } from '@testing-library/react';
import { noop } from 'lodash';
import { http, HttpResponse } from 'msw';
import { MemoryRouter } from 'react-router-dom';

import Bootstrapper from './bootstrapper';
import server from '../mocks/server';
import { useAccountStore } from '../store/account';

describe('boot network calls', () => {
	it('fires components.json only once even when carbonioPrefSendAnalytics=TRUE arrives from GetInfo', async () => {
		vi.spyOn(console, 'warn').mockImplementation(noop);
		vi.spyOn(console, 'error').mockImplementation(noop);

		let componentsCalls = 0;
		server.use(
			http.get('/static/iris/components.json', () => {
				componentsCalls += 1;
				return HttpResponse.json({ components: [] });
			})
		);

		render(
			<MemoryRouter>
				<Suspense fallback={<div data-testid={'splash'} />}>
					<Bootstrapper />
				</Suspense>
			</MemoryRouter>
		);

		await waitFor(() => expect(componentsCalls).toBe(1));

		// simulate what getSessionInfo does when GetInfoResponse lands
		// for a user that has opted into analytics
		act(() => {
			const current = useAccountStore.getState();
			useAccountStore.setState({
				authenticated: true,
				settings: {
					...current.settings,
					prefs: { ...current.settings.prefs, carbonioPrefSendAnalytics: 'TRUE' }
				}
			});
		});

		await act(async () => {
			await vi.advanceTimersByTimeAsync(500);
		});

		expect(componentsCalls).toBe(1);
	});
});
