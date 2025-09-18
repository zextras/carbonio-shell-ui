/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { LoadingView } from './boot/splash';
import { BASENAME } from './constants';
import { LOCAL_STORAGE_ENABLE_STRICT_MODE } from './constants/internal-constants';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

window.addEventListener('contextmenu', (ev) => {
	const path = ev.composedPath?.() || [];

	const isAllowedTarget = path.some(
		(element) => element instanceof HTMLElement && ['A', 'IMG'].includes(element.tagName)
	);

	const selection = window.getSelection?.();
	const isTextSelection = selection?.type === 'Range';

	const hasBypassClass = path.some(
		(element) =>
			element instanceof HTMLElement && element.classList.contains('carbonio-bypass-context-menu')
	);

	if (!(isAllowedTarget || isTextSelection || hasBypassClass)) {
		ev.preventDefault();
	}
});

const Bootstrapper = lazy(() => import('./boot/bootstrapper'));

if (module.hot) {
	module.hot.accept();
}

const router = createBrowserRouter(
	[
		{
			path: '/*',
			element: (
				<Suspense fallback={<LoadingView />}>
					<Bootstrapper key="boot" />
				</Suspense>
			)
		}
	],
	{ basename: BASENAME }
);

const root = ReactDOM.createRoot(document.getElementById('app')!);
let enableStrictMode = false;
try {
	enableStrictMode = window.localStorage.getItem(LOCAL_STORAGE_ENABLE_STRICT_MODE) === 'true';
} catch (err) {
	console.warn('localStorage is unavailable; defaulting to strict mode off', err);
}

const app = enableStrictMode ? (
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
) : (
	<RouterProvider router={router} />
);
root.render(app);
