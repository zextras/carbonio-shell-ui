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

import { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { ItemActionContext } from '../itemActions/ItemActionContext';
import { map } from 'lodash';
import { ItemAction, WrappedItemAction } from '../itemActions/IItemAction';

function reducer(state: Array<WrappedItemAction>, action: { type: string; itemAction?: WrappedItemAction}): Array<WrappedItemAction> {
	switch (action.type) {
		case 'reset': return [];
		case 'add': {
			const newState = [ ...state ];
			if (action.itemAction) {
				newState.push(action.itemAction);
			}
			return newState;
		}
		default: return state;
	}
}

function useItemActionContext(ctxt: string, obj: any): { actions: Array<WrappedItemAction>; loading: boolean } {
	const { actions } = useContext(ItemActionContext);
	const [loading, setLoading] = useState(false);
	const [enabledActions, dispatch] = useReducer(reducer, []);
	const wrappedAdd = useCallback((newAction: ItemAction) => dispatch(
		{
			type: 'add',
			itemAction: {
				id: newAction.id,
				icon: newAction.icon,
				label: newAction.label,
				onActivate: () => newAction.onActivate(obj)
			}
		}
	), [obj]);
	useEffect(
		() => {
		dispatch({type:'reset'});
			let cancel = false;
			setLoading(true);
			Promise.all(
				map(
					actions[ctxt] || [],
					(action) => action.onCheck(obj)
						.then((pass: boolean) => {
							if (pass && !cancel) {
								wrappedAdd(action);
							}
						})
				)
			).finally(() => !cancel && setLoading(false));
			return () => { cancel = true; };
		},
		[actions, obj, ctxt]
	);
	return {
		actions: enabledActions,
		loading
	}
}

export default useItemActionContext;
