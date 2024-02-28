/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { produce } from 'immer';
import { findIndex, merge, reduce, some } from 'lodash';
import { create } from 'zustand';

import { normalizeApp } from './utils';
import type { AppState, CarbonioModule } from '../../../types';
import { SHELL_APP_ID } from '../../constants';

const FOCUS_MODE_RESPONSE = 'focus-mode';

function addIfNotPresent<T extends { id: unknown }>(
	items: T[],
	itemToAdd: T,
	onAdd?: (items: T[], item: T) => void
): void {
	if (!some(items, (item) => item.id === itemToAdd.id)) {
		items.push(itemToAdd);
		onAdd?.(items, itemToAdd);
	}
}

function sortByPosition<T extends { position: number }>(items: T[]): void {
	items.sort((a, b) => a.position - b.position);
}

function addAndSort<T extends { id: unknown; position: number }>(items: T[], itemToAdd: T): void {
	addIfNotPresent(items, itemToAdd, sortByPosition);
}

function removeById<T extends { id: unknown }>(items: T[], id: unknown): void {
	const index = findIndex(items, (item) => item.id === id);
	if (index !== -1) {
		items.splice(index, 1);
	}
}

// extra currying as suggested in https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#basic-usage
export const useAppStore = create<AppState>()((set, get) => ({
	focusMode: false,
	apps: {},
	appContexts: {},
	shell: {
		commit: '',
		description: '',
		js_entrypoint: '',
		name: SHELL_APP_ID,
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
		setApps: (apps): void => {
			set(() => {
				const { moduleApps, shellApp, appContexts } = reduce<
					Partial<CarbonioModule>,
					{
						moduleApps: AppState['apps'];
						shellApp: AppState['shell'];
						appContexts: AppState['appContexts'];
					}
				>(
					apps,
					(accumulator, app) => {
						if (app.name) {
							const normalizedApp = normalizeApp(app);
							if (app.name !== SHELL_APP_ID) {
								accumulator.moduleApps[app.name] = normalizedApp;
							} else {
								accumulator.shellApp = normalizedApp;
							}
							accumulator.appContexts[app.name] = {};
						}
						return accumulator;
					},
					{ moduleApps: {}, shellApp: {} as CarbonioModule, appContexts: {} }
				);
				return {
					apps: moduleApps,
					shell: shellApp,
					appContexts
				};
			});
		},
		setAppContext:
			(app) =>
			(context): void => {
				set(
					produce<AppState>((state) => {
						state.appContexts[app] = merge(state.appContexts[app], context);
					})
				);
			},
		// add route (id route primaryBar secondaryBar app)
		addRoute: (routeData): string => {
			const { focusMode } = get();
			if (focusMode && (routeData.route !== focusMode || !routeData.focusMode)) {
				return FOCUS_MODE_RESPONSE;
			}
			set(
				produce<AppState>((state) => {
					state.routes[routeData.id] = routeData;
					if (routeData.primaryBar && !routeData.focusMode) {
						addAndSort(state.views.primaryBar, {
							app: routeData.app,
							id: routeData.id,
							route: routeData.route,
							component: routeData.primaryBar,
							badge: routeData.badge,
							position: routeData.position,
							visible: routeData.visible,
							label: routeData.label
						});
					}
					if (routeData.secondaryBar) {
						addIfNotPresent(state.views.secondaryBar, {
							app: routeData.app,
							id: routeData.id,
							route: routeData.route,
							component: routeData.secondaryBar
						});
					}
					if (routeData.appView) {
						addIfNotPresent(state.views.appView, {
							app: routeData.app,
							id: routeData.id,
							route: routeData.route,
							component: routeData.appView
						});
					}
					if (routeData.app && state.apps[routeData.app] && routeData.focusMode !== true) {
						state.apps[routeData.app].display = routeData.label;
					}
				})
			);
			return routeData.id;
		},
		setRouteVisibility: (id, visible): void => {
			set(
				produce<AppState>((state) => {
					const idx = findIndex(state.views.primaryBar, (view) => view.id === id);
					if (idx >= 0) {
						state.views.primaryBar[idx].visible = visible;
					}
				})
			);
		},

		// remove route (id | route)
		removeRoute: (id): void => {
			set(
				produce<AppState>((state) => {
					delete state.routes[id];
					removeById(state.views.primaryBar, id);
					removeById(state.views.secondaryBar, id);
					removeById(state.views.appView, id);
				})
			);
		},
		// add board
		addBoardView: (data): string => {
			set(
				produce<AppState>((state) => {
					addIfNotPresent(state.views.board, data);
				})
			);
			return data.id;
		},

		// remove board
		removeBoardView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.board, id);
				})
			);
		},

		// add settings
		addSettingsView: (data): string => {
			const { focusMode } = get();
			if (focusMode && data.route !== focusMode) {
				return FOCUS_MODE_RESPONSE;
			}
			set(
				produce<AppState>((state) => {
					addAndSort(state.views.settings, data);
				})
			);
			return data.id;
		},

		// remove settings
		removeSettingsView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.settings, id);
				})
			);
		},
		//
		// add search
		addSearchView: (data): string => {
			const { focusMode } = get();
			if (focusMode && data.route !== focusMode) {
				return FOCUS_MODE_RESPONSE;
			}
			set(
				produce<AppState>((state) => {
					addAndSort(state.views.search, data);
				})
			);
			return data.id;
		},
		// remove search
		removeSearchView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.search, id);
				})
			);
		},
		//
		// add utility
		addUtilityView: (data): string => {
			set(
				produce<AppState>((state) => {
					addAndSort(state.views.utilityBar, data);
				})
			);
			return data.id;
		},
		// remove utility
		removeUtilityView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.utilityBar, id);
				})
			);
		},
		//
		// add primaryAccessory
		addPrimaryAccessoryView: (data): string => {
			set(
				produce<AppState>((state) => {
					addAndSort(state.views.primaryBarAccessories, data);
				})
			);
			return data.id;
		},
		// remove primaryAccessory
		removePrimaryAccessoryView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.primaryBarAccessories, id);
				})
			);
		},
		//
		// add secondaryAccessory
		addSecondaryAccessoryView: (data): string => {
			set(
				produce<AppState>((state) => {
					addAndSort(state.views.secondaryBarAccessories, data);
				})
			);
			return data.id;
		},
		// remove secondaryAccessory
		removeSecondaryAccessoryView: (id): void => {
			set(
				produce<AppState>((state) => {
					removeById(state.views.secondaryBarAccessories, id);
				})
			);
		},
		updatePrimaryBadge: (badge, id): void => {
			set(
				produce<AppState>((state) => {
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
		updateUtilityBadge: (badge, id): void => {
			set(
				produce<AppState>((state) => {
					const idx = findIndex(state.views.utilityBar, (bar) => bar.id === id);
					if (idx >= 0) {
						state.views.utilityBar[idx].badge = {
							...state.views.utilityBar[idx].badge,
							...badge
						};
					}
				})
			);
		}
	}
}));
