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

import { find } from 'lodash';

interface MockableFetchWindow extends Window {
	fetch: MockedFetch;
}

type MockedFetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

const MOCKS: MockedResponse[] = [];
let _throwErrorIfRequestNotMocked = false;
let originalFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;

function mockedFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
	// TODO: Mock the fetch request here
	const mock = find(
		MOCKS,
		({ request }) => {
			if (request.input === input) {
				// TODO: Improve checks on mocked requests
				return true;
			}
			return false;
		}
	);
	if (!mock && _throwErrorIfRequestNotMocked) {
		return Promise.reject(new Error(`Request '${input}' not mocked.`));
	}
	else if (!mock) {
		return originalFetch(input, init);
	}
	else {
		return Promise.resolve(
			new Response(JSON.stringify(mock.response))
		);
	}
}

export function install(wnd: Window): void {
	originalFetch = wnd['fetch'];
	(wnd as unknown as MockableFetchWindow)['fetch'] = mockedFetch;
}

export function addMockedResponse(response: MockedResponse): void {
	MOCKS.push(response);
}

export function throwErrorIfRequestNotMocked(val: boolean = true): void {
	_throwErrorIfRequestNotMocked = val;
}
