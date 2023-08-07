/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	BrowserClient,
	defaultIntegrations,
	defaultStackParser,
	Hub,
	makeFetchTransport
} from '@sentry/browser';
import { reduce } from 'lodash';
import { create } from 'zustand';

import type { CarbonioModule } from '../../types';
import { SENTRY_SHELL_DSN, SHELL_APP_ID } from '../constants';

type ReporterState = {
	clients: Record<string, Hub>;
	setClients: (apps: Array<CarbonioModule>) => void;
};

export const useReporter = create<ReporterState>()((set) => ({
	clients: {
		[SHELL_APP_ID]: new Hub(
			new BrowserClient({
				transport: makeFetchTransport,
				stackParser: defaultStackParser,
				integrations: defaultIntegrations,
				dsn: SENTRY_SHELL_DSN,
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
								transport: makeFetchTransport,
								stackParser: defaultStackParser,
								integrations: defaultIntegrations,
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
}));
