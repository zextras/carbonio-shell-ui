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
import { ComponentClass } from 'react';
import { AppData, AppState, CoreAppData } from './store-types';
import { ZextrasModule } from '../account/types';

export const appStore = createStore<AppState>((set) => ({
	apps: {},
	setters: {
		addApps: (apps: Array<ZextrasModule>): void =>
			set(
				produce((state) => {
					state.apps = reduce(
						apps,
						(acc, core) => ({
							...acc,
							[core.name]: { core }
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
			)
	}
}));

export const useAppStore = create(appStore);
