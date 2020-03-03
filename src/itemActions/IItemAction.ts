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


import { Context, createContext, ReactElement } from 'react';
import { BehaviorSubject } from 'rxjs';

export type ItemActionMap = {[ctxt: string]: Array<ItemAction>};

export interface IItemActionContext {
	actions: ItemActionMap;
}

export interface IItemActionService {
	actions: BehaviorSubject<ItemActionMap>;
	addAction: (pkg: string, version: string, ctxt: string, appAction: AppItemAction) => void;
	removeAction: (pkg: string, version: string, ctxt: string, name: string) => void;
}

export type ItemActionContextProviderProps = {
	itemActionSrvc: IItemActionService;
}

export type AppItemAction = {
	/** The name of the action, must be unique inside an App */ name: string;
	/** The icon of the action */ icon: ReactElement;
	/** The icon of the action */ label: string;
	/** The callback invoked on an item */ onActivate: (item: any) => void;
	/** @optional Function to check if the action can be applied to the item(s) */ onCheck?: (item: any) => Promise<boolean>;
};

export type ItemAction = AppItemAction & {
	package: string;
	version: string;
	onCheck: (item: any) => Promise<boolean>;
};

export type WrappedItemAction = {
	icon: ReactElement;
	label: string;
	onActivate: () => void;
};
