/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import { filter, find, findIndex, identity, merge, omit, reduce, unionWith } from 'lodash';
import create, { GetState, SetState, StoreApi, UseBoundStore } from 'zustand';
import {
	AppRouteData,
	AppRouteDescriptor,
	AppState,
	AppView,
	BadgeInfo,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	PrimaryBarView,
	SearchView,
	SecondaryAccessoryView,
	SecondaryBarView,
	SettingsView,
	SHELL_APP_ID,
	UtilityView
} from '../../../types';
import { normalizeApp } from './utils';

const filterById = <T extends { id: string }>(items: Array<T>, id: string): Array<T> =>
	filter(items, (item) => item.id !== id);

export const useAppStore = create<AppState>((set) => ({
	apps: {},
	appContexts: {},
	shell: {
		commit: '',
		description: '',
		js_entrypoint: '',
		name: 'carbonio-shell-ui',
		priority: -1,
		version: '',
		type: 'shell',
		attrKey: '',
		icon: '',
		display: 'Shell'
	},
	entryPoints: {},
	routes: {},
	views: {
		primaryBar: [],
		secondaryBar: [],
		appView: [],
		board: [],
		utilityBar: [],
		settings: [],
		search: [],
		primaryBarAccessories: [],
		secondaryBarAccessories: []
	},
	setters: {
		addApps: (apps: Array<Partial<CarbonioModule>>): void => {
			set((state) => ({
				apps: reduce(
					filter(apps, (app) => app.name !== SHELL_APP_ID),
					(acc, app) =>
						app.name
							? {
									...acc,
									[app.name]: normalizeApp(app)
							  }
							: acc,
					{}
				),
				shell: {
					...state.shell,
					...(find(apps, (app) => app.name === SHELL_APP_ID) ?? {})
				},
				appContexts: reduce(apps, (acc, val) => (val.name ? { ...acc, [val.name]: {} } : acc), {})
			}));
		},
		setAppContext:
			(app: string) =>
			(context: unknown): void => {
				set(
					produce((state: AppState) => {
						state.appContexts[app] = merge(state.appContexts[app], context);
					})
				);
			},
		// add route (id route primaryBar secondaryBar app)
		addRoute: (routeData: AppRouteDescriptor): string => {
			set(
				produce((state: AppState) => {
					state.routes[routeData.id] = routeData;
					if (routeData.primaryBar) {
						state.views.primaryBar = unionWith<PrimaryBarView>(
							[
								{
									app: routeData.app,
									id: routeData.id,
									route: routeData.route,
									component: routeData.primaryBar,
									badge: routeData.badge,
									position: routeData.position,
									visible: routeData.visible,
									label: routeData.label
								}
							],
							state.views.primaryBar,
							(a, b): boolean => a.id === b.id
						);
					}
					if (routeData.secondaryBar) {
						state.views.secondaryBar = unionWith<SecondaryBarView>(
							[
								{
									app: routeData.app,
									id: routeData.id,
									route: routeData.route,
									component: routeData.secondaryBar
								}
							],
							state.views.secondaryBar,
							(a, b): boolean => a.id === b.id
						);
					}
					if (routeData.appView) {
						state.views.appView = unionWith<AppView>(
							[
								{
									app: routeData.app,
									id: routeData.id,
									route: routeData.route,
									component: routeData.appView
								}
							],
							state.views.appView,
							(a, b): boolean => a.id === b.id
						);
					}
				})
			);
			return routeData.id;
		},
		setRouteVisibility: (id: string, visible: boolean): void => {
			set(
				produce((state: AppState) => {
					const idx = findIndex(state.views.primaryBar, (view) => view.id === id);
					if (idx >= 0) {
						state.views.primaryBar[idx].visible = visible;
					}
				})
			);
		},

		// remove route (id | route)
		removeRoute: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.routes = omit(state.routes, [id]);
					state.views.primaryBar = filterById(state.views.primaryBar, id);
					state.views.secondaryBar = filterById(state.views.secondaryBar, id);
					state.views.appView = filterById(state.views.appView, id);
				})
			);
		},

		// update primaryBar
		updatePrimaryBadge: (id: string, badge: BadgeInfo): void => {
			set(
				produce((state: AppState) => {
					const idx = findIndex(state.views.primaryBar, (bar) => bar.id === id);
					if (idx >= 0) {
						state.views.primaryBar[idx].badge = {
							...state.views.primaryBar[idx].badge,
							...badge
						};
					}
				})
			);
		},

		// add board
		addBoardView: (data: BoardView): string => {
			set(
				produce((state: AppState) => {
					state.views.board.push(data);
				})
			);
			return data.id;
		},

		// remove board
		removeBoardView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.board = filterById(state.views.board, id);
				})
			);
		},

		// add settings
		addSettingsView: (data: SettingsView): string => {
			set(
				produce((state: AppState) => {
					state.views.settings.push(data);
				})
			);
			return data.id;
		},

		// remove settings
		removeSettingsView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.settings = filterById(state.views.settings, id);
				})
			);
		},
		//
		// add search
		addSearchView: (data: SearchView): string => {
			set(
				produce((state: AppState) => {
					state.views.search.push(data);
				})
			);
			return data.id;
		},
		// remove search
		removeSearchView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.search = filterById(state.views.search, id);
				})
			);
		},
		//
		// add utility
		addUtilityView: (data: UtilityView): string => {
			set(
				produce((state: AppState) => {
					state.views.utilityBar.push(data);
				})
			);
			return data.id;
		},
		// remove utility
		removeUtilityView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.utilityBar = filterById(state.views.utilityBar, id);
				})
			);
		},
		//
		// add primaryAccessory
		addPrimaryAccessoryView: (data: PrimaryAccessoryView): string => {
			set(
				produce((state: AppState) => {
					state.views.primaryBarAccessories.push(data);
				})
			);
			return data.id;
		},
		// remove primaryAccessory
		removePrimaryAccessoryView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.primaryBarAccessories = filterById(state.views.primaryBarAccessories, id);
				})
			);
		},
		//
		// add secondaryAccessory
		addSecondaryAccessoryView: (data: SecondaryAccessoryView): string => {
			set(
				produce((state: AppState) => {
					state.views.secondaryBarAccessories.push(data);
				})
			);
			return data.id;
		},
		// remove secondaryAccessory
		removeSecondaryAccessoryView: (id: string): void => {
			set(
				produce((state: AppState) => {
					state.views.secondaryBarAccessories = filterById(state.views.secondaryBarAccessories, id);
				})
			);
		}
	}
})) as UseBoundStore<AppState, StoreApi<AppState>>;
