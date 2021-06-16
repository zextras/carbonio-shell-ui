import create from 'zustand';
import createStore from 'zustand/vanilla';
import { reduce } from 'lodash';
import { produce } from 'immer';
import { AppData, AppState, CoreAppData, IntegrationsRegister } from './store-types';
import { settingsAppData } from '../../settings/settings-app-data';

export const appStore = createStore<AppState>((set) => ({
	apps: {
		com_zextras_zapp_settings: settingsAppData
	},
	integrations: {
		components: {},
		hooks: {},
		functions: {},
		actions: {}
	},
	setters: {
		addApps: (apps: Array<CoreAppData>): void =>
			set(
				produce((state) => {
					state.apps = reduce(
						apps,
						(acc, core) => ({
							...acc,
							[core.package]: { core }
						}),
						state.apps
					);
				})
			),
		registerAppData: (id: string) => (data: Partial<Omit<AppData, 'core'>>): void =>
			set(
				produce((state) => {
					state.apps[id] = { ...state.apps[id], ...data };
				})
			),
		setAppContext: (id: string) => (data: unknown): void =>
			set(
				produce((state) => {
					state.apps[id].context = data;
				})
			),
		registerIntegrations: (appId: string) => ({
			components,
			hooks,
			functions,
			actions
		}: IntegrationsRegister): void =>
			set(
				produce((state) => {
					state.integrations.components = reduce(
						components,
						(acc, val, key) => {
							// eslint-disable-next-line no-param-reassign
							acc[key] = { app: appId, item: val };
						},
						state.integrations.components
					);
					state.integrations.hooks = reduce(
						hooks,
						(acc, val, key) => {
							// eslint-disable-next-line no-param-reassign
							acc[key] = { app: appId, item: val };
						},
						state.integrations.hooks
					);
					state.integrations.functions = reduce(
						functions,
						(acc, val, key) => {
							// eslint-disable-next-line no-param-reassign
							acc[key] = { app: appId, item: val };
						},
						state.integrations.functions
					);
					state.integrations.actions = reduce(
						actions,
						(acc, val, key) => {
							// eslint-disable-next-line no-param-reassign
							acc[key] = { app: appId, item: val };
						},
						state.integrations.actions
					);
				})
			)
	}
}));

export const useAppStore = create(appStore);
