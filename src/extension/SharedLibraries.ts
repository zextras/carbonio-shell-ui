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

import { ComponentClass, Context, FunctionComponent, ReactElement } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { INotificationParser } from '../network/INetworkService';
import { ISoapFolderObj, ISoapResponseContent, JsnsUrn } from '../network/ISoap';
import { IIdbExtensionService } from '../idb/IIdbExtensionService';
import { IOfflineContext } from '../offline/IOfflineContext';
import { IScreenSizeContext } from '../screenSize/IScreenSizeContext';
import { IOfflineService } from '../offline/IOfflineService';
import { IFCEvent, IFCSink } from '../fc/IFiberChannel';
import { ISyncItemParser, ISyncFolderParser, ISyncOperation, ISyncOpRequest } from '../sync/ISyncService';
import { ISessionService } from '../session/ISessionService';
import { ISyncContext } from '../sync/ISyncContext';
import { IFolderSchm } from '../sync/IFolderSchm';
import { IIDBFolderSchm } from '../idb/IShellIdbSchema';
import { IDBPDatabase } from 'idb';
import { II18nContext } from '../i18n/II18nContext';
import I18nService from '../i18n/I18nService';

export type RegisterRouteFn = <T>(path: string, component: ComponentClass<T>|FunctionComponent<T>, defProps: T) => void;
export type AddMainMenuItemFn = (icon: ReactElement, label: string, to: string) => void;
export type AddCreateMenuItemFn = (icon: ReactElement, label: string, to: string) => void;

export interface ISharedLibrariesAppsMap {
  'clsx': {};
  'react': {};
  '@material-ui/core': {};
  '@material-ui/core/styles': {};
  '@material-ui/icons': {};
  'idb': {};
  'lodash': {};
  'rxjs': {};
  'rxjs/operators': {};
  '@zextras/zapp-shell/context': ISharedZxContexts;
  '@zextras/zapp-shell/fc': ISharedFiberChannelService;
  '@zextras/zapp-shell/idb': IIdbExtensionService<any>;
  '@zextras/zapp-shell/network': ISharedZxNetwork;
  '@zextras/zapp-shell/router': ISharedZxRoute;
  '@zextras/zapp-shell/service': ISharesZxServices;
  '@zextras/zapp-shell/sync': ISharedZxSync;
  '@zextras/zapp-shell/utils': ISharedShellUtils;
}

export interface ISharedLibrariesThemesMap {
  '@material-ui/core': {};
}

interface ISharedZxContexts {
  OfflineCtxt: Context<IOfflineContext>;
  ScreenSizeCtxt: Context<IScreenSizeContext>;
  SyncCtxt: Context<ISyncContext>;
  I18nCtxt: Context<II18nContext>;
}

interface ISharedFiberChannelService {
  fc: Observable<IFCEvent<any>>;
  fcSink: IFCSink;
}

interface ISharedZxNetwork {
  sendSOAPRequest<REQ, RESP extends ISoapResponseContent>(command: string, data: REQ, urn?: string | JsnsUrn): Promise<RESP>;
  registerNotificationParser(tagName: string, parser: INotificationParser<any>): void;
}

interface ISharedZxSync {
  registerSyncItemParser(tagName: string, parser: ISyncItemParser<any>): void;
  registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<any>): void;
  syncFolderById(folderId: string): void;
  syncOperations: BehaviorSubject<Array<ISyncOperation<any, ISyncOpRequest<any>>>>;
}

interface ISharedZxRoute {
  registerRoute: RegisterRouteFn;
  addMainMenuItem: AddMainMenuItemFn;
  addCreateMenuItem: AddCreateMenuItemFn;
}

interface ISharesZxServices {
  offlineSrvc: IOfflineService;
  sessionSrvc: ISessionService;
}

interface ISharedShellUtils {
  normalizeFolder<T extends IFolderSchm>(version: number, f: ISoapFolderObj): Array<T>;
  createFolderIdb<T extends IIDBFolderSchm>(version: number, db: IDBPDatabase<T>): void;
  registerLanguage(bundle: any, lang: string): void;
}
