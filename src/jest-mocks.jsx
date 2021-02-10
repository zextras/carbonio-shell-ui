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
import path from 'path';
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import fetch from 'node-fetch';
import { MemoryRouter } from 'react-router-dom';
import { extendTheme, ThemeProvider } from '@zextras/zapp-ui';
import AppContextWrapper from './mocks/app-context-wrapper';
import { usePushHistoryCallback, useReplaceHistoryCallback, useRemoveCurrentBoard } from './shell/hooks';
import { useSharedComponent } from './shared-ui-components/use-shared-component';

const confPath = path.resolve(
	process.cwd(),
	'zapp.conf.js'
);
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
			[`${api}Request`]: body,
		},
	};
	// if (this._csrfToken) {
	// 	request.Header = {
	// 		_jsns: 'urn:zimbra',
	// 		context: {
	// 			csrfToken: this._csrfToken
	// 		}
	// 	};
	// }
	return fetch(
		new URL(`/service/soap/${api}Request`, 'http://localhost'),
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		},
	)
		.then((r) => r.json())
		.then((resp) => {
			if (resp.Body.Fault) {
				throw new Error(resp.Body.Fault.Reason.Text);
			}
			return resp.Body[`${api}Response`];
		});
}

export const network = {
	soapFetch,
};

export const fiberChannel = jest.fn();
export const fiberChannelSink = jest.fn();

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
			<ThemeProvider
				theme={extendTheme({})}
			>
				<AppContextWrapper
					packageName={packageName}
					packageVersion={packageVersion}
					ctxt={ctxt}
					reducer={reducer}
					preloadedState={preloadedState}
				>
					{ children }
				</AppContextWrapper>
			</ThemeProvider>
		</MemoryRouter>
	);

	return rtlRender(
		ui,
		{
			wrapper: Wrapper,
			...options,
		}
	);
}

export const testUtils = {
	render
};

export const hooks = {
	useReplaceHistoryCallback: jest.fn(useReplaceHistoryCallback),
	usePushHistoryCallback: jest.fn(usePushHistoryCallback),
	useUserAccounts: jest.fn(() => []),
	useRemoveCurrentBoard: jest.fn(useRemoveCurrentBoard),
	useSharedComponent: jest.fn(useSharedComponent),
};
