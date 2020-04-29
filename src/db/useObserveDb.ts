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

import { useEffect, useMemo, useState } from 'react';
import { Database } from './database';

export function useObserveDb(query: () => Promise<any>, db: Database): any {
	const [val, setVal] = useState([null, false]);

	useEffect(() => {
		let canSet = true;
		if (!db) return;
		setVal([null, false]);
		query().then((v) => {
			if (canSet) setVal([v, true]);
		});
		const sub = db.observe(query)
			.subscribe((v) => {
				if (canSet) setVal([v, true]);
			});
		return () => {
			canSet = false;
			sub.unsubscribe();
		};
	}, [setVal, db, query]);

	return val;
}
