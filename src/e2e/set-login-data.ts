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

import { filter, reduce } from 'lodash';
import ShellDb from '../db/shell-db';
import Account, {  ThemePkgDescription } from '../db/account';
import { ZimletPkgDescription } from '../network/soap/types';
import { zimletToAppPkgDescription, zimletToThemePkgDescription } from '../network/soap/utils';
import { E2EContext } from './e2e-types';
import { AppPkgDescription } from '../../types';

const ACCOUNT_ID = '00000000-0000-4000-8000-000000000000';
const ACCOUNT_NAME = 'user@example.com';

export default function(ctxt: E2EContext): Promise<void> {
	return new Promise((resolve, reject) => {
		const zimlet: ZimletPkgDescription[] = [];
		switch (FLAVOR) {
			// case 'E2E':
			// 	if (cliSettings.app_package) {
			// 		zimlet.push({
			// 			zimletContext: [{
			// 				baseUrl: `/service/zimlet/${cliSettings.app_package.package}/`,
			// 				priority: 1,
			// 				presence: 'enabled'
			// 			}],
			// 			zimlet: [{
			// 				zapp: 'true',
			// 				description: `${cliSettings.app_package.description}`,
			// 				label: `${cliSettings.app_package.label}`,
			// 				name: `${cliSettings.app_package.name}`,
			// 				version: `${cliSettings.app_package.version}`,
			// 				'zapp-main': 'app.bundle.js',
			// 			}]
			// 		});
			// 	}
			// 	break;
			case 'E2E':
			case 'NPM':
				zimlet.push({
					zimletContext: [{
						baseUrl: `/service/zimlet/${cliSettings.app_package!.package}/`,
						priority: 1,
						presence: 'enabled'
					}],
					zimlet: [{
						zapp: 'true',
						description: `${cliSettings.app_package!.description}`,
						label: `${cliSettings.app_package!.label}`,
						name: `${cliSettings.app_package!.name}`,
						version: `${cliSettings.app_package!.version}`,
						...(cliSettings.app_package!.type === 'app'
							? { 'zapp-main': 'app.bundle.js' }
							: { 'zapp-theme': 'theme.bundle.js' }),
					}]
				});
				break;
		}
		// Mocking response to prevent to call api calls in case of explicit login/logout
		e2e.addMockedResponse({
			request: {
				input: '/service/soap/AuthRequest'
			},
			response: {
				Body: {
					AuthResponse: {
						authToken: [{
							_content: ''
						}]
					}
				}
			}
		});
		e2e.addMockedResponse({
			request: {
				input: '/service/soap/GetInfoRequest'
			},
			response: {
				Body: {
					GetInfoResponse: {
						id: ACCOUNT_ID,
						name: ACCOUNT_NAME,
						zimlets: {
							zimlet
						}
					}
				}
			}
		});
		e2e.addMockedResponse({
			request: {
				input: '/service/soap/EndSessionRequest'
			},
			response: {
				Body: {
					EndSessionResponse: {}
				}
			}
		});
		// Injecting the user ass logged in
		ctxt.db.accounts.clear()
			.then(() => ctxt.db.accounts.add(
					new Account(
						ACCOUNT_ID,
						ACCOUNT_ID,
						{
							t: '',
							u: '',
							p: ''
						},
						reduce<ZimletPkgDescription, AppPkgDescription[]>(
							filter<ZimletPkgDescription>(
								zimlet,
								(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined')
							),
							(r, z) => ([...r, zimletToAppPkgDescription(z)]),
							[]
						),
						reduce<ZimletPkgDescription, ThemePkgDescription[]>(
							filter(
								zimlet,
								(z) => (z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-theme'] !== 'undefined')
							),
							(r, z) => ([...r, zimletToThemePkgDescription(z)]),
							[]
						),
					)
				))
			.then(() => {
				resolve();
			});
	});
}
