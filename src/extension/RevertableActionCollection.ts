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

import { IMainSubMenuItemData, IRouterService } from '../router/IRouterService';
import { INetworkService } from '../network/INetworkService';
import { Observable } from 'rxjs';

export default class RevertableActionCollection {

	private _registeredRoutes: string[] = [];
	private _registeredMainMenuItems: string[] = [];
	private _registeredCreateMenuItems: string[] = [];

	constructor(
		private _routerService: IRouterService,
		private _networkService: INetworkService,
	) {}

	public revert(): void {
		forEach(this._registeredRoutes, (id) => this._routerService.unregisterRouteById(id));
		forEach(this._registeredMainMenuItems, (id) => this._routerService.unregisterMainMenuItemById(id));
		forEach(this._registeredCreateMenuItems, (id) => this._routerService.unregisterCreateMenuItemById(id));
	}

	public registerRoute<T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T, pkgName: string): void {
		this._registeredRoutes.push(
			this._routerService.registerRoute<T>(path, component, defProps, pkgName)
		);
	}

	public addMainMenuItem(icon: string, label: string, to: string, pkgName: string, children?: Observable<Array<IMainSubMenuItemData>>): void {
		this._registeredMainMenuItems.push(
			this._routerService.addMainMenuItem(icon, label, to, pkgName, children)
		);
	}

	public addCreateMenuItem(icon: string, label: string, to: string, app: string) {
		this._registeredCreateMenuItems.push(
			this._routerService.addCreateMenuItem(icon, label, to, app)
		);
	}
}
