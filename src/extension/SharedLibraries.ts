/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { ComponentClass, Context, FunctionComponent } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { ISoapFolderObj, ISoapResponseContent, JsnsUrn } from '../network/ISoap';
import { IIdbExtensionService } from '../idb/IIdbExtensionService';
import { IOfflineContext } from '../offline/IOfflineContext';
import { IScreenSizeContext } from '../screenSize/IScreenSizeContext';
import { IOfflineService } from '../offline/IOfflineService';
import { IFCEvent, IFCSink } from '../fc/IFiberChannel';
import { ISyncOperation, ISyncOpRequest } from '../sync/ISyncService';
import { ISessionService } from '../session/ISessionService';
import { ISyncContext } from '../sync/ISyncContext';
import { IFolderSchm } from '../sync/IFolderSchm';
import { IIDBFolderSchm } from '../idb/IShellIdbSchema';
import { IDBPDatabase } from 'idb';
import { II18nContext } from '../i18n/II18nContext';
import { IMainSubMenuItemData } from '../router/IRouterService';
import { AppItemAction, WrappedItemAction } from '../itemActions/IItemActionContext';

export type RegisterRouteFn = <T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T) => void;
export type AddMainMenuItemFn = (icon: string, label: string, to: string, child: Observable<Array<IMainSubMenuItemData>>) => void;
export type AddCreateMenuItemFn = (icon: string, label: string, to: string) => void;

export type ISharedLibrariesAppsMap = {
	'react': {};
	'react-dom': {};
	'idb': {};
	'lodash': {};
	'rxjs': {};
	'rxjs/operators': {};
	'react-router': {};
	'react-router-dom': {};
	'styled-components': {};
	'prop-types': {};
	'moment': {};
	'@zextras/zapp-shell/itemActions': SharedItemActions;
	'@zextras/zapp-shell/context': SharedZxContexts;
	'@zextras/zapp-shell/fc': SharedFiberChannelService;
	'@zextras/zapp-shell/hooks': SharedHooks;
	'@zextras/zapp-shell/idb': IIdbExtensionService<any>;
	'@zextras/zapp-shell/network': SharedZxNetwork;
	'@zextras/zapp-shell/router': SharedZxRoute;
	'@zextras/zapp-shell/service': SharesZxServices;
	'@zextras/zapp-shell/sync': SharedZxSync;
	'@zextras/zapp-shell/utils': SharedShellUtils;
	'@zextras/zapp-ui': {};
};

export type SharedLibrariesThemesMap = {
};

type SharedZxContexts = {
	OfflineCtxt: Context<IOfflineContext>;
	ScreenSizeCtxt: Context<IScreenSizeContext>;
	SyncCtxt: Context<ISyncContext>;
	I18nCtxt: Context<II18nContext>;
};

type SharedFiberChannelService = {
	fc: Observable<IFCEvent<any>>;
	fcSink: IFCSink;
};

type SharedZxNetwork = {
	sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: string | JsnsUrn): Promise<RESP>;
};

type SharedZxSync = {
	syncOperations: BehaviorSubject<Array<ISyncOperation<any, ISyncOpRequest<any>>>>;
};

type SharedZxRoute = {
	registerRoute: RegisterRouteFn;
	addMainMenuItem: AddMainMenuItemFn;
	addCreateMenuItem: AddCreateMenuItemFn;
};

type SharesZxServices = {
	offlineSrvc: IOfflineService;
	sessionSrvc: ISessionService;
};

type SharedShellUtils = {
	normalizeFolder<T extends IFolderSchm>(version: number, f: ISoapFolderObj): Array<T>;
	createFolderIdb<T extends IIDBFolderSchm>(version: number, db: IDBPDatabase<T>): void;
	registerLanguage(bundle: any, lang: string): void;
};

type SharedItemActions = {
	registerItemAction(action: AppItemAction): void;
};

type SharedHooks = {
	useItemActionContext(context: string, item: any): WrappedItemAction[];
};
