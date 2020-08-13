
/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { ComponentClass, LazyExoticComponent } from 'react';
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
	usePushHistoryCallback(location: LocationDescriptor): void;
	useGoBackHistoryCallback(): void;
	useReplaceHistoryCallback(location: LocationDescriptor): void;
	useBehaviorSubject<T>(observable: BehaviorSubject<T>): T;
	useAppContext<T>(): T;
	useObserveDb<T>(query: () => Promise<T>, db: Database): [T, boolean];
	useAppPkg(): () => AppPkgDescription;
};


export const ui: any;

export const db: {
	Database: IDatabaseConstructor;
};

