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

import { ComponentClass, LazyExoticComponent } from 'react';
import { Reducer } from 'redux';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ISyncProtocol } from 'dexie-syncable/api';
import Dexie, { Database, DexieOptions } from 'dexie';
import { LocationDescriptor } from 'history';

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

export type ThemePkgDescription = BasePkgDescription & {};

export type AccountAppsData = Array<AppPkgDescription>;
export type AccountThemesData = Array<ThemePkgDescription>;

export type AccountLoginData = {
	/** Zimbra auth token */ t: string;
	/** Username */ u: string;
	/** Password */ p: string;
	csrfToken: string;
};

export type Account = {
	id: string;
	name: string;
	apps: AccountAppsData;
	themes: AccountThemesData;
	displayName: string;
};

export type FCPartialEvent<T extends {} | string> = {
	asPromise?: true;
	to?: {
		version: string;
		app: string;
	};
	event: string;
	data: T;
};

export type FCEvent<T extends {} | string> = FCPartialEvent<T> & {
	from: string;
	version: string;
};

export type FCPartialPromisedEvent<T extends {} | string> = FCPartialEvent<T> & {
	asPromise: true;
};

export type FCPromisedEvent<T extends {} | string, R extends {} | string> = FCEvent<T> & {
	sendResponse: (data: R) => void;
};
// Type is in the documentation. If changed update also the documentation.
export type MainSubMenuItemData = {
	id: string;
	icon?: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
};
// Type is in the documentation. If changed update also the documentation.
export type MainMenuItemData = {
	id: string;
	icon: string;
	label: string;
	to: string;
	children?: Array<MainSubMenuItemData>;
	customComponent?: React.Component;
};
// Type is in the documentation. If changed update also the documentation.
export type AppRouteDescription = {
	route: string;
	view: LazyExoticComponent<any>;
	label: LazyExoticComponent<any>;
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

interface IDatabase {
	createUUID(): string;
	registerSyncProtocol(name: string, protocol: ISyncProtocol): void;
	observe(comparator: () => Promise<any>): Subject<any>;
}

interface IEnhancedDatabase extends Dexie, IDatabase {}

interface IDatabaseConstructor {
	new(databaseName: string, options?: DexieOptions): IEnhancedDatabase;
}

export type FCSink = <T extends {} | string, R extends {} | string>(event: FCPartialEvent<T> | FCPartialPromisedEvent<T>) => void | Promise<R>;
export type FC = Observable<FCEvent<any> | FCPromisedEvent<any, any>>;

export function setMainMenuItems (items: MainMenuItemData[]): void;
export function setRoutes (routes: AppRouteDescription[]): void;
export function setCreateOptions (options: AppCreateOption[]): void;
export function setAppContext (obj: any): void;
export function addSharedUiComponent (scope: string, componentClass: ComponentClass): void;

export const fiberChannel: FC;
export const fiberChannelSink: FCSink;

export const hooks: {
	useAddBoardCallback(path: string): () => void;
	useAppContext<T>(): T;
	useAppPkg(): AppPkgDescription;
	useBehaviorSubject<T>(observable: BehaviorSubject<T>): T;
	useFiberChannel();
	useGoBackHistoryCallback(): void;
	useObserveDb<T>(query: () => Promise<T>, db: Database): [T, boolean];
	usePromise();
	usePushHistoryCallback(): (location: LocationDescriptor) => void;
	useRemoveCurrentBoard(): () => void;
	useReplaceHistoryCallback(): (location: LocationDescriptor) => void;
	useTranslation();
	useUserAccounts(): Account[];
};

export const ui: any;

/** @deprecated */
export const db: {
	Database: IDatabaseConstructor;
};

export const store: {
	store: Store<any>;
	setReducer(nextReducer: Reducer): void;
};

export type SoapRequest = {
	_jsns: 'urn:zimbra'
		| 'urn:zimbraAccount'
		| 'urn:zimbraAdmin'
		| 'urn:zimbraAdminExt'
		| 'urn:zimbraMail'
		| 'urn:zimbraRepl'
		| 'urn:zimbraSync'
		| 'urn:zimbraVoice'
	;
};

export type SoapFetch =
	<REQ, RESP>(api: string, body: REQ & SoapRequest) => Promise<RESP>;

export const network: {
	soapFetch: SoapFetch;
};
