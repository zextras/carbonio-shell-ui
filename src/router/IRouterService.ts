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

import { ComponentClass, FunctionComponent, ReactElement } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IRouterService {
	routes: BehaviorSubject<IRouteData>;
	mainMenuItems: BehaviorSubject<Array<IMainMenuItemData>>;
	createMenuItems: BehaviorSubject<Array<ICreateMenuItemData>>;
	currentRoute: BehaviorSubject<string>;
	registerRoute: RegisterRouteFn;
	addMainMenuItem: AddMainMenuItemFn;
	addCreateMenuItem: AddCreateMenuItemFn;

	unregisterRouteById(id: string): void;

	unregisterMainMenuItemById(id: string): void;

	unregisterCreateMenuItemById(id: string): void;
}

export interface ISingleRouteDetails<T> {
	id: string;
	component: ComponentClass<T> | FunctionComponent<T>;
	defProps: T;
	pkgName: string;
}

export interface IRouteData {
	[path: string]: ISingleRouteDetails<any>;
}

export interface IMainMenuItemData {
	id: string;
	icon: ReactElement;
	label: string;
	to: string;
	children?: Observable<Array<IMainSubMenuItemData>>;
}

export interface IMainSubMenuItemData {
	id: string;
	icon: ReactElement;
	label: string;
	to: string;
	children?: Array<IMainSubMenuItemData>;
}

export interface ICreateMenuItemData {
	id: string;
	icon: ReactElement;
	label: string;
	app: string;
	to: string;
}

export type RegisterRouteFn = <T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T, pkgName: string) => string;
export type AddMainMenuItemFn = (icon: ReactElement, label: string, to: string, children?: Observable<Array<IMainSubMenuItemData>>) => string;
export type AddCreateMenuItemFn = (icon: ReactElement, label: string, to: string, app: string) => string;
