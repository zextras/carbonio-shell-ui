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
import { Observable } from 'rxjs';
import { AppItemAction, IItemActionService } from '../itemActions/IItemAction';

export default class RevertableActionCollection {

	private _registeredRoutes: string[] = [];
	private _registeredMainMenuItems: string[] = [];
	private _registeredCreateMenuItems: string[] = [];
	private _registeredItemActions: { id: string; ctxt: string; pkg: string; version: string }[] = [];

	constructor(
		private _routerSrvc: IRouterService,
		private _itemActionSrvc: IItemActionService
	) {}

	public revert(): void {
		forEach(this._registeredRoutes, (id) => this._routerSrvc.unregisterRouteById(id));
		this._registeredRoutes = [];
		forEach(this._registeredMainMenuItems, (id) => this._routerSrvc.unregisterMainMenuItemById(id));
		this._registeredMainMenuItems = [];
		forEach(this._registeredCreateMenuItems, (id) => this._routerSrvc.unregisterCreateMenuItemById(id));
		this._registeredCreateMenuItems = [];
		forEach(this._registeredItemActions, ({ id, ctxt, pkg, version }) => this._itemActionSrvc.removeAction(pkg, version, ctxt, id));
		this._registeredItemActions = [];
	}

	public registerRoute<T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T, pkgName: string): void {
		this._registeredRoutes.push(
			this._routerSrvc.registerRoute<T>(path, component, defProps, pkgName)
		);
	}

	public addMainMenuItem(icon: string, label: string, to: string, pkgName: string, children?: Observable<Array<IMainSubMenuItemData>>): void {
		this._registeredMainMenuItems.push(
			this._routerSrvc.addMainMenuItem(icon, label, to, pkgName, children)
		);
	}

	public addCreateMenuItem(icon: string, label: string, to: string, app: string): void {
		this._registeredCreateMenuItems.push(
			this._routerSrvc.addCreateMenuItem(icon, label, to, app)
		);
	}

	public registerItemAction(pkg: string, version: string, ctxt: string, action: AppItemAction): void {
		this._itemActionSrvc.addAction(pkg, version, ctxt, action);
		this._registeredItemActions.push({ id: action.id, ctxt, pkg, version });
	}
}
