/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import { useEffect, useState } from 'react';
import { Database } from './database';

export function useObserveDb(query: () => Promise<any>, db: Database): any {
	const [val, setVal] = useState([null, false]);

	useEffect((): () => void => {
		let canSet = true;
		if (!db) return (): void => undefined;
		setVal([null, false]);
		query().then((v) => {
			if (canSet) setVal([v, true]);
		});
		const sub = db.observe(query)
			.subscribe((v) => {
				if (canSet) setVal([v, true]);
			});

		return (): void => {
			canSet = false;
			sub.unsubscribe();
		};
	}, [setVal, db, query]);

	return val;
}
