/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */
import create from 'zustand';
import createStore from 'zustand/vanilla';
import { reduce } from 'lodash';
import { produce } from 'immer';
import { Component, ComponentClass } from 'react';
import { AppData, AppState, CoreAppData, IntegrationsRegister } from './store-types';

export const appStore = createStore<AppState>((set) => ({
	apps: {},
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
		setAppClass: (id: string, component: ComponentClass): void =>
			set(
				produce((state) => {
					if (state.apps[id]) {
						state.apps[id].class = component;
					}
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
					if (components) {
						state.integrations.components = reduce(
							components,
							(acc, val, key) => ({
								...acc,
								[key]: { app: appId, item: val }
							}),
							state.integrations.components
						);
					}
					if (hooks) {
						state.integrations.hooks = reduce(
							hooks,
							(acc, val, key) => ({
								...acc,
								[key]: { app: appId, item: val }
							}),
							state.integrations.hooks
						);
					}
					if (functions) {
						state.integrations.functions = reduce(
							functions,
							(acc, val, key) => ({
								...acc,
								[key]: { app: appId, item: val }
							}),
							state.integrations.functions
						);
					}
					if (actions) {
						state.integrations.actions = reduce(
							actions,
							(acc, val, key) => ({
								...acc,
								[key]: { app: appId, item: val }
							}),
							state.integrations.actions
						);
					}
				})
			)
	}
}));

export const useAppStore = create(appStore);
