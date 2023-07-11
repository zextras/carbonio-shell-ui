/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { type Hub } from '@sentry/browser';
import { create } from 'zustand';

import { CarbonioModule } from '../../../types';

type ReporterState = {
	clients: Record<string, Hub>;
	setClients: (apps: Array<CarbonioModule>) => void;
};

export const useReporter = create<ReporterState>()(() => ({
	clients: {},
	setClients: (): void => {
		// do nothing
	}
}));
