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

import { BehaviorSubject } from 'rxjs';
import { IItemActionService, AppItemAction, ItemActionMap } from './IItemAction';
import { filter } from 'lodash';

function _defaultOnCheck(obj: any): Promise<boolean> {
	return Promise.resolve(true);
}

export class ItemActionService implements IItemActionService {

	private _actions: ItemActionMap = {};

	public actions = new BehaviorSubject<ItemActionMap>(this._actions);

	public addAction(pkg: string, version: string, ctxt: string, appAction: AppItemAction): void {
		if (!this._actions[ctxt]) this._actions[ctxt] = [];
		this._actions[ctxt].push({
			...appAction,
			onCheck: appAction.onCheck || _defaultOnCheck,
			package: pkg,
			version
		});
		this.actions.next(this._actions);
	}

	public removeAction(pkg: string, version: string, ctxt: string, id: string): void {
		if (this._actions[ctxt]) {
			this.actions.next({
				...this._actions,
				[ctxt]: filter(
					this._actions[ctxt],
					(action) => !(
						action.id === id
						&& action.package === pkg
						&& action.version === version
					)
				)
			})
		}
	}
}
