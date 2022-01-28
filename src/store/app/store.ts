/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import produce from 'immer';
import { filter, find, findIndex, merge, omit, reduce, unionWith } from 'lodash';
import create from 'zustand';
import {
	AppRouteData,
	AppState,
	AppView,
	BadgeInfo,
	BoardView,
	CarbonioModule,
	PrimaryAccessoryView,
	PrimaryBarView,
	SearchView,
	SEARCH_APP_ID,
	SecondaryAccessoryView,
	SecondaryBarView,
	SettingsView,
	SETTINGS_APP_ID,
	SHELL_APP_ID,
	UtilityView
} from '../../../types';
import { SearchAppView } from '../../search/search-app-view';
import { SettingsAppView } from '../../settings/settings-app-view';
import { SettingsSidebar } from '../../settings/settings-sidebar';
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
		displayName: 'Shell'
	},
	entryPoints: {},
	routes: {
		[SEARCH_APP_ID]: {
			route: SEARCH_APP_ID,
			id: SEARCH_APP_ID,
			app: SEARCH_APP_ID
		},
		[SETTINGS_APP_ID]: {
			route: SETTINGS_APP_ID,
			id: SETTINGS_APP_ID,
			app: SETTINGS_APP_ID
		}
	},
	views: {
		primaryBar: [
			{
				id: SEARCH_APP_ID,
				app: SEARCH_APP_ID,
				route: SEARCH_APP_ID,
				component: 'SearchModOutline',
				position: 15,
				visible: true,
				label: 'Search',
				badge: {
					show: false
				}
			},
			{
				id: SETTINGS_APP_ID,
				app: SETTINGS_APP_ID,
				route: SETTINGS_APP_ID,
				component: 'SettingsModOutline',
				position: 16,
				visible: true,
				label: 'Settings',
				badge: {
					show: false
				}
			}
		],
		secondaryBar: [
			{
				id: SETTINGS_APP_ID,
				app: SETTINGS_APP_ID,
				route: SETTINGS_APP_ID,
				component: SettingsSidebar
			}
		],
		appView: [
			{
				id: SEARCH_APP_ID,
				app: SEARCH_APP_ID,
				route: SEARCH_APP_ID,
				component: SearchAppView
			},
			{
				id: SETTINGS_APP_ID,
				app: SETTINGS_APP_ID,
				route: SETTINGS_APP_ID,
				component: SettingsAppView
			}
		],
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
		addRoute: (routeData: AppRouteData): string => {
			set(
				produce((state: AppState) => {
					state.routes[routeData.id] = routeData;
					if (routeData.primaryBar) {
						state.views.primaryBar = unionWith<PrimaryBarView>(
							[routeData.primaryBar],
							state.views.primaryBar,
							(a, b): boolean => a.id === b.id
						);
					}
					if (routeData.secondaryBar) {
						state.views.secondaryBar = unionWith<SecondaryBarView>(
							[routeData.secondaryBar],
							state.views.secondaryBar,
							(a, b): boolean => a.id === b.id
						);
					}
					if (routeData.appView) {
						state.views.appView = unionWith<AppView>(
							[routeData.appView],
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
		addBoardView: (id: string, data: BoardView): string => {
			set(
				produce((state: AppState) => {
					state.views.board.push(data);
				})
			);
			return id;
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
		addSettingsView: (id: string, data: SettingsView): string => {
			set(
				produce((state: AppState) => {
					state.views.settings.push(data);
				})
			);
			return id;
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
		addSearchView: (id: string, data: SearchView): string => {
			set(
				produce((state: AppState) => {
					state.views.search.push(data);
				})
			);
			return id;
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
		addUtilityView: (id: string, data: UtilityView): string => {
			set(
				produce((state: AppState) => {
					state.views.utilityBar.push(data);
				})
			);
			return id;
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
		addPrimaryAccessoryView: (id: string, data: PrimaryAccessoryView): string => {
			set(
				produce((state: AppState) => {
					state.views.primaryBarAccessories.push(data);
				})
			);
			return id;
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
		addSecondaryAccessoryView: (id: string, data: SecondaryAccessoryView): string => {
			set(
				produce((state: AppState) => {
					state.views.secondaryBarAccessories.push(data);
				})
			);
			return id;
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
}));
