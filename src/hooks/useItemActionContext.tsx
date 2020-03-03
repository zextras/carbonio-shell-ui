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

import { useContext, useEffect, useState } from 'react';
import { ItemActionContext } from '../itemActions/ItemActionContext';
import { map } from 'lodash';
import { WrappedItemAction } from '../itemActions/IItemAction';

function useItemActionContext(ctxt: string, obj: any): { actions: Array<WrappedItemAction>; loading: boolean } {
	const { actions } = useContext(ItemActionContext);
	const [ itemActions, setItemActions ] = useState<Array<WrappedItemAction>>([]);
	const [ loading, setLoading ] = useState<boolean>(false);
	useEffect(
		() => {
			let cancel = false;
			const updatedActions: Array<WrappedItemAction> = [];
			setLoading(true);
			Promise.all(
				map(
					actions[ctxt] || [],
					(action) => action.onCheck(obj)
						.then((pass: boolean) => {
							if (pass && !cancel) {
								updatedActions.push(
									{
										icon: action.icon,
										label: action.label,
										onActivate: () => action.onActivate(obj)
									}
								);
								setItemActions(updatedActions);
							}
						})
				)
			)
				.finally(() => !cancel && setLoading(false));
			return () => { cancel = true; };
		},
		[actions]
	);

	return {
		actions: itemActions,
		loading
	}
}

export default useItemActionContext;
