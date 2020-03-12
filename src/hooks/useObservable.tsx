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

import { useState, useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';

export default function useObservable<T>(observable: BehaviorSubject<T>): T {
	const [value, setValue] = useState<T>(observable.value);
	useEffect(() => {
		const sub = observable.subscribe(setValue);
		return () => sub.unsubscribe();
	}, [observable]);
	return value;
}
