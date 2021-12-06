/*
 * SPDX-FileCopyrightText: 2021 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create from 'zustand';
import createStore from 'zustand/vanilla';
import { find, reduce } from 'lodash';
import { produce } from 'immer';
import { ComponentClass } from 'react';
import { SHELL_APP_ID } from '../../constants';
import { AppData, AppState, ZextrasModule } from '../../../types';

export const appStore = createStore<AppState>((set) => ({
	apps: {},
	setters: {
		addApps: (apps: Array<ZextrasModule>): void =>
			set(
				produce((state) => {
					state.apps = reduce(
						apps,
						(acc, core) =>
							core.name === SHELL_APP_ID
								? acc
								: {
										...acc,
										[core.name]: { core }
								  },
						state.apps
					);
					state.shell = find(apps, (app) => app.name === SHELL_APP_ID);
				})
			),
		setAppClass: (id: string, component: ComponentClass): void =>
			set(
				produce((state) => {
					if (state.apps[id]) {
						state.apps[id].class = component;
					}
				})
			),
		registerAppData:
			(id: string) =>
			(data: Partial<Omit<AppData, 'core'>>): void =>
				set(
					produce((state) => {
						Object.assign(state.apps[id], data);
					})
				),
		setAppContext:
			(id: string) =>
			(data: unknown): void =>
				set(
					produce((state) => {
						state.apps[id].context = data;
					})
				)
	}
}));

export const useAppStore = create(appStore);
