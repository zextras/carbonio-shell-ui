/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { RenderOptions, RenderResult } from '@testing-library/react';
import React, { ComponentClass, LazyExoticComponent } from 'react';
import { Reducer } from 'redux';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationDescriptor } from 'history';
import { Store } from '@reduxjs/toolkit';

export type BasePkgDescription = {
	priority: number;
	package: string;
	name: string;
	description: string;
	version: string;
	resourceUrl: string;
	entryPoint: string;
};

export type AppPkgDescription = BasePkgDescription & {
	swExtension?: string;
	styleEntryPoint?: string;
	handlers?: string;
};

export type ThemePkgDescription = BasePkgDescription & unknown;

export type AccountAppsData = Array<AppPkgDescription>;
export type AccountThemesData = Array<ThemePkgDescription>;

export type AccountLoginData = {
	/** Zimbra auth token */ t: string;
	/** Username */ u: string;
	/** Password */ p: string;
	csrfToken: string;
};

export type ZimletProp = {
	name: string;
	zimlet: string;
	_content: string;
};

export type AccountSettings = {
	attrs: Record<string, any>;
	prefs: Record<string, any>;
	props: Array<ZimletProp>;
};

export type Account = {
	id: string;
	name: string;
	apps: AccountAppsData;
	themes: AccountThemesData;
	displayName: string;
	settings: AccountSettings;
	signatures: { signature: Array<any> };
	identities: { identity: Array<any> };
};

export type FCPartialEvent<T extends unknown | string> = {
	asPromise?: true;
	to?: {
		version: string;
		app: string;
	};
	event: string;
	data: T;
};

export type FCEvent<T extends unknown | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};

export type FCPartialPromisedEvent<T extends unknown | string> = FCPartialEvent<T> & {
	asPromise: true;
};

export type FCPromisedEvent<T extends unknown | string, R extends unknown | string> = FCEvent<T> & {
	sendResponse: (data: R) => void;
};
// Type is in the documentation. If changed update also the documentation.
export type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	items?: Array<MainSubMenuItemData>;
};
// Type is in the documentation. If changed update also the documentation.
export type MainMenuItemData = {
	id: string;
	icon: string;
	label: string;
	to: string;
	items?: Array<MainSubMenuItemData>;
	customComponent?: React.Component;
};
// Type is in the documentation. If changed update also the documentation.
export type AppRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
};
// Type is in the documentation. If changed update also the documentation.
export type AppSettingsRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
	to: string;
	id: string;
};
// Type is in the documentation. If changed update also the documentation.
export type AppCreateOption = {
	id: string;
	onClick?: () => void;
	app: {
		path: string;
		boardPath?: string;
		getPath?: () => undefined;
	};
	label: string;
};

export type FCSink = <T extends unknown | string, R extends unknown | string>(
	event: FCPartialEvent<T> | FCPartialPromisedEvent<T>
) => void | Promise<R>;
export type FC = Observable<FCEvent<any> | FCPromisedEvent<any, any>>;

export function setMainMenuItems(items: MainMenuItemData[]): void;
export function setRoutes(routes: AppRouteDescription[]): void;
export function setCreateOptions(options: AppCreateOption[]): void;
export function setAppContext(obj: any): void;
export function addSharedUiComponent(scope: string, componentClass: ComponentClass): void;

export const fiberChannel: FC;
export const fiberChannelSink: FCSink;

export const hooks: {
	useAddBoardCallback(path: string): () => void;
	useAppContext<T>(): T;
	useAppPkg(): AppPkgDescription;
	useBehaviorSubject<T>(observable: BehaviorSubject<T>): T;
	useFiberChannel(): FC;
	useGoBackHistoryCallback(): void;
	usePromise(): any;
	usePushHistoryCallback(): (location: LocationDescriptor) => void;
	useRemoveCurrentBoard(): () => void;
	useReplaceHistoryCallback(): (location: LocationDescriptor) => void;
	useSaveSettingsCallback(): (mods: {
		props: Record<string, { value: any; app: string }>;
		prefs: Record<string, any>;
	}) => void;
	useUserAccounts(): Account[];
	useCSRFToken(): string;
};

export const ui: any;

export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};

export type SoapRequest = {
	_jsns:
		| 'urn:zimbra'
		| 'urn:zimbraAccount'
		| 'urn:zimbraAdmin'
		| 'urn:zimbraAdminExt'
		| 'urn:zimbraMail'
		| 'urn:zimbraRepl'
		| 'urn:zimbraSync'
		| 'urn:zimbraVoice';
};

export type SoapFetch = <REQ, RESP>(api: string, body: REQ & SoapRequest) => Promise<RESP>;

export type SoapError = {
	message: string;
	details: any;
};

export const network: {
	soapFetch: SoapFetch;
};

export const testUtils: {
	render(
		// eslint-disable-next-line no-shadow
		ui: React.ReactElement,
		options?: Omit<RenderOptions, 'queries'>
	): RenderResult;
};
