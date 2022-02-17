/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create, { StoreApi, UseBoundStore } from 'zustand';
import { BrowserClient, Hub } from '@sentry/browser';
import { reduce } from 'lodash';
import { CarbonioModule, SHELL_APP_ID } from '../../types';

type ReporterState = {
	clients: Record<string, Hub>;
	setClients: (apps: Array<CarbonioModule>) => void;
};

export const useReporter = create<ReporterState>((set) => ({
	clients: {
		[SHELL_APP_ID]: new Hub(
			new BrowserClient({
				dsn: 'https://0ce2448c05b94f0182c47ae52c7ff52c@feedback.zextras.tools/6',
				release: '0',
				maxValueLength: 500
			})
		),
		feedbacks: new Hub(
			new BrowserClient({
				dsn: 'https://1b6b3e2bbdc64a73bf45c72b725c56b4@feedback.zextras.tools/8',
				release: '0',
				maxValueLength: 500
			})
		)
	},
	setClients: (apps): void => {
		set((s) => ({
			clients: reduce(
				apps,
				(acc, app) => {
					if (app.sentryDsn) {
						// eslint-disable-next-line no-param-reassign
						s.clients[app.name] = new Hub(
							new BrowserClient({
								dsn: app.sentryDsn,
								release: app.version,
								maxValueLength: 500
							})
						);
					}
					return acc;
				},
				s.clients
			)
		}));
	}
})) as UseBoundStore<ReporterState, StoreApi<ReporterState>>;
