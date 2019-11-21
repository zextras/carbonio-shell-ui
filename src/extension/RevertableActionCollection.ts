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

import { forEach } from 'lodash';
import { ComponentClass, FunctionComponent, ReactElement } from 'react';

import { IRouterService } from '../router/IRouterService';
import { INetworkService, INotificationParser } from '../network/INetworkService';
import { ISyncItemParser, ISyncFolderParser, ISyncService } from '../sync/ISyncService';

export default class RevertableActionCollection {
  
  private _registeredRoutes: string[] = [];
  private _registeredMainMenuItems: string[] = [];
  private _registeredNotificationParsers: string[] = [];
  private _registeredSyncParsers: string[] = [];

  constructor(
    private _routerService: IRouterService,
    private _networkService: INetworkService,
    private _syncService: ISyncService
  ) {}
  
  public revert(): void {
    forEach(this._registeredRoutes, (id) => this._routerService.unregisterRouteById(id));
    forEach(this._registeredMainMenuItems, (id) => this._routerService.unregisterMainMenuItemById(id));
    forEach(this._registeredNotificationParsers, (id) => this._networkService.unregisterNotificationParserById(id));
    forEach(this._registeredSyncParsers, (id) => this._syncService.unregisterSyncParserById(id));
  }

  public registerRoute<T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T): void {
    this._registeredRoutes.push(
      this._routerService.registerRoute<T>(path, component, defProps)
    );
  }

  public addMainMenuItem(icon: ReactElement, label: string, to: string): void {
    this._registeredMainMenuItems.push(
      this._routerService.addMainMenuItem(icon, label, to)
    );
  }

  public registerNotificationParser(tagName: string, parser: INotificationParser<any>): void {
    this._registeredNotificationParsers.push(
      this._networkService.registerNotificationParser(tagName, parser)
    );
  }

  public registerSyncItemParser(tagName: string, parser: ISyncItemParser<any>): void {
    this._registeredSyncParsers.push(
      this._syncService.registerSyncItemParser(tagName, parser)
    );
  }

  public registerSyncFolderParser(tagName: string, parser: ISyncFolderParser<any>): void {
    this._registeredSyncParsers.push(
      this._syncService.registerSyncFolderParser(tagName, parser)
    );
  }
}
