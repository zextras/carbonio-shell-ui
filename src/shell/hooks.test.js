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
jest.mock('@zextras/zapp-ui');
jest.mock('../db/database');
// eslint-disable-next-line
import React from 'react';// eslint-disable-next-line
import { BehaviorSubject } from 'rxjs';// eslint-disable-next-line
import { renderHook, act } from '@testing-library/react-hooks';// eslint-disable-next-line
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
