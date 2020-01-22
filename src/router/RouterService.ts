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

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ComponentClass, FunctionComponent, ReactElement } from 'react';
import { filter, omitBy } from 'lodash';
import {
	ICreateMenuItemData,
	IMainMenuItemData, IMainSubMenuItemData,
	IRouteData,
	IRouterService,
	ISingleRouteDetails
} from './IRouterService';

export default class RouterService implements IRouterService {

	public routes: BehaviorSubject<IRouteData> = new BehaviorSubject<IRouteData>({});
	public mainMenuItems: BehaviorSubject<Array<IMainMenuItemData>> = new BehaviorSubject<Array<IMainMenuItemData>>([]);
	public createMenuItems: BehaviorSubject<Array<ICreateMenuItemData>> = new BehaviorSubject<Array<ICreateMenuItemData>>([]);
	public currentRoute: BehaviorSubject<string> = new BehaviorSubject<string>('');

	private _id = 0;
	private _menuSubs: { [path: string]: Subscription } = {};

	public registerRoute<T>(path: string, component: ComponentClass<T> | FunctionComponent<T>, defProps: T, pkgName: string): string {
		const id = `${++this._id}`;
		this.routes.next({
			[path]: {
				id: `${id}`,
				component,
				defProps,
				pkgName
			},
			...this.routes.getValue()
		});
		return id;
	}

	public addMainMenuItem(icon: ReactElement, label: string, to: string, app: string, children?: Observable<Array<IMainSubMenuItemData>>): string {
		const id = `${++this._id}`;
		if (children) {
			this._menuSubs[id] = children.subscribe(folders => {
				this.mainMenuItems.next(
					[
						...filter(this.mainMenuItems.value, item => item.to !== to),
						{
							id: `${id}`,
							icon,
							label,
							to,
							app,
							children: folders
						}
					]
				)
			});
		}
		else {
			this.mainMenuItems.next(
				[
					...this.mainMenuItems.getValue(),
					{
						id: `${id}`,
						icon,
						label,
						to,
						app
					}
				]
			);
		}
		return id;
	}

	public addCreateMenuItem(icon: ReactElement, label: string, to: string, app: string): string {
		const id = `${++this._id}`;
		this.createMenuItems.next(
			[
				...this.createMenuItems.getValue(),
				{
					id,
					to,
					label,
					icon,
					app
				}
			]
		);
		return id;
	}

	public unregisterRouteById(id: string): void {
		this.routes.next(
			omitBy(this.routes.getValue(), (o: ISingleRouteDetails<any>, k: string) => o.id === id)
		);
	}

	public unregisterMainMenuItemById(id: string): void {
		this.mainMenuItems.next(
			filter(this.mainMenuItems.getValue(), (o: IMainMenuItemData) => o.id !== id)
		);
		this._menuSubs[id].unsubscribe();
	}

	public unregisterCreateMenuItemById(id: string): void {
		this.createMenuItems.next(
			filter(this.createMenuItems.getValue(), (o: ICreateMenuItemData) => o.id !== id)
		);
	}

}
