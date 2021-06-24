/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React from 'react';
import { BehaviorSubject } from 'rxjs';
import { renderHook, act } from '@testing-library/react-hooks';
import { useBehaviorSubject } from './hooks';

describe('Hooks', () => {
	test('useBehaviorSubject', () => {
		const bs = new BehaviorSubject(1);
		const { result } = renderHook(() => useBehaviorSubject(bs));

		expect(result.current).toBe(1);

		act(() => {
			bs.next(2);
		});

		expect(result.current).toBe(2);
	});
});
