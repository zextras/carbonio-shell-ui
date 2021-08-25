/* eslint-disable import/no-extraneous-dependencies */
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
import { render as rtlRender } from '@testing-library/react';
import fetch from 'node-fetch';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@zextras/zapp-ui';
import AppContextWrapper from './mocks/app-context-wrapper';
import {
	getUsePushHistoryCallback,
	getUseReplaceHistoryCallback,
	useRemoveCurrentBoard
} from './shell/hooks';

const confPath = `${process.cwd()}/zapp.conf.js`;
// eslint-disable-next-line max-len
// eslint-disable-next-line global-require,import/no-dynamic-require,@typescript-eslint/no-var-requires
const conf = require(confPath);

// jest.mock('react-i18next', () => ({
// 	// this mock makes sure any components using the translate hook can use it without a warning being shown
// 	useTranslation: () => {
// 		return {
// 			t: (str) => str,
// 			i18n: {
// 				changeLanguage: () => new Promise(() => {}),
// 			},
// 		};
// 	},
// }));

function soapFetch(api, body) {
	const request = {
		Body: {
			[`${api}Request`]: body
		}
	};
	// if (this._csrfToken) {
	// 	request.Header = {
	// 		_jsns: 'urn:zimbra',
	// 		context: {
	// 			csrfToken: this._csrfToken
	// 		}
	// 	};
	// }
	return fetch(new URL(`/service/soap/${api}Request`, 'http://localhost'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	})
		.then((r) => r.json())
		.then((resp) => {
			if (resp.Body.Fault) {
				throw new Error(resp.Body.Fault.Reason.Text);
			}
			return resp.Body[`${api}Response`];
		});
}

export const network = {
	soapFetch
};

function render(
	ui,
	{
		ctxt = {},
		reducer,
		preloadedState,
		initialRouterEntries = ['/'],
		packageName = conf.pkgName,
		packageVersion = conf.version,
		...options
	} = {}
) {
	const Wrapper = ({ children }) => (
		<MemoryRouter initialEntries={initialRouterEntries}>
			<ThemeProvider>
				<AppContextWrapper
					packageName={packageName}
					packageVersion={packageVersion}
					ctxt={ctxt}
					reducer={reducer}
					preloadedState={preloadedState}
				>
					{children}
				</AppContextWrapper>
			</ThemeProvider>
		</MemoryRouter>
	);

	return rtlRender(ui, {
		wrapper: Wrapper,
		...options
	});
}

export const testUtils = {
	render
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const setAppContext = jest.fn(() => {});

export const hooks = {
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useReplaceHistoryCallback: jest.fn(getUseReplaceHistoryCallback('com_zextras_test')),
	usePushHistoryCallback: jest.fn(getUsePushHistoryCallback('com_zextras_test')),
	useUserAccounts: jest.fn(() => [{ name: '' }]),
	useRemoveCurrentBoard: jest.fn(useRemoveCurrentBoard)
};

export const useSharedFunction = jest.fn(() => jest.fn());
