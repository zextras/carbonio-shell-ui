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

import { rest } from 'msw';
import faker from 'faker';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';
import { ZimletPkgDescription } from '../../types';

function getCompleteUrl(api: string): string {
	return `/service/soap/${api}Request`;
}

function getCompleteResponse(api: string, response: any): any {
	return {
		Body: {
			[`${api}Response`]: response
		}
	};
}

export function generateHandlers(cliSettings: cliSettingsNamespace): RequestHandlersList {
	const handlers = [];
	if (!cliSettings.server) {
		handlers.push(
			rest.post(getCompleteUrl('Auth'), (req, res, ctx) => {
				const authToken = `0_${faker.random.hexaDecimal(327)}`;
				return res(
					ctx.status(200),
					ctx.set('Content-Type', 'application/json'),
					ctx.cookie('ZM_AUTH_TOKEN', authToken, {
						path: '/',
						httpOnly: true,
						secure: true
					}),
					ctx.json(
						getCompleteResponse('Auth', {
							csrfToken: {
								_content: `0_${faker.random.alphaNumeric(40)}`
							},
							authToken: [
								{
									_content: authToken
								}
							],
							lifetime: 35999999,
							// skin: [{ _content: 'tree' }],
							prefs: {
								_attrs: {
									zimbraPrefMailPollingInterval: '500'
								}
							}
						})
					)
				);
			}),
			rest.post(getCompleteUrl('EndSession'), (req, res, ctx) =>
				res(
					ctx.status(200),
					ctx.cookie('ZM_AUTH_TOKEN', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('JSESSIONID', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('AUTH_TOKEN_TYPE', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('T', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('Y', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('ADMIN_AUTH_KEY', '', {
						path: '/',
						httpOnly: true,
						secure: true,
						expires: new Date(0),
						maxAge: 0
					}),
					ctx.cookie('ZM_TEST', 'true', {
						path: '/',
						secure: true,
						expires: new Date(0),
						maxAge: 0
					})
					// ctx.cookie(
					// 	'ZM_LOGIN_CSRF',
					// 	'', // UUID?
					// 	{
					// 		path: '/',
					// 		httpOnly: true,
					// 		secure: true,
					// 		expires: new Date(0),
					// 		maxAge: 0
					// 	}
					// ),
				)
			),
			rest.post(getCompleteUrl('GetInfo'), async (req, res, ctx) => {
				const zimletData: ZimletPkgDescription[] = [
					{
						zimletContext: [
							{
								baseUrl: `/service/zimlet/${cliSettings.app_package.name}/`,
								priority: 1,
								presence: 'enabled'
							}
						],
						zimlet: [
							{
								description: `${cliSettings.app_package.description}`,
								zapp: 'true',
								label: `${cliSettings.app_package.label}`,
								name: `${cliSettings.app_package.name}`,
								version: `${cliSettings.app_package.version}`
							}
						]
					}
				];
				if (cliSettings.app_package.type === 'theme') {
					zimletData[0].zimlet[0]['zapp-theme'] = 'theme.bundle.js';
				} else {
					zimletData[0].zimlet[0]['zapp-main'] = 'app.bundle.js';
				}

				if (cliSettings.hasHandlers) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					zimletData[0].zimlet['zapp-handlers'] = 'handlers.bundle.js';
				}

				// if (!cliSettings.server) {
				return res(
					ctx.status(200),
					ctx.json(
						getCompleteResponse('GetInfo', {
							id: faker.random.uuid(),
							name: faker.internet.email(),
							zimlets: {
								zimlet: zimletData
							},
							attrs: {
								_attrs: {
									displayName: `${faker.name.firstName()} ${faker.name.lastName()}`
								}
							}
						})
					)
				);
				// }

				/*
				We cannot run this code as if a server is set, https will be used with a self-signed
				certificate (created by webpack).
				Chrome will not load the service worker from the insecure origin, so this code cannot be executed.

				const originalResponse = await ctx.fetch(req)
				const originalResponseData = await originalResponse.json();

				zimletData[0].zimletContext[0].priority = reduce(
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet,
					(max, z) => ((z.zimletContext[0].priority > max) ? z.zimletContext[0].priority : max),
					-1
				);

				const foundZimlet = find(
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet,
					(z) => z.zimlet[0].name === cliSettings.app_package.package
				);

				if (cliSettings.isWatch) {
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet = filter(
						originalResponseData.Body.GetInfoResponse.zimlets.zimlet,
						(z) => {
							if (cliSettings.app_package.type !== 'theme') {
								return typeof z.zimlet[0]['zapp-theme'] !== 'undefined';
							}

							return false;
						}
					);
				}
				else if (cliSettings.app_package.type === 'theme') {
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet = filter(
						originalResponseData.Body.GetInfoResponse.zimlets.zimlet,
						(z) => typeof z.zimlet[0]['zapp-theme'] === 'undefined'
					);
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet.push(zimletData);
				}

				if (foundZimlet && !cliSettings.isStandalone) {
					foundZimlet.zimletContext = [{
						...zimletData[0].zimletContext[0]
					}];
					foundZimlet.zimlet = [{
						...zimletData[0].zimlet[0]
					}];
				}
				else {
					originalResponseData.Body.GetInfoResponse.zimlets.zimlet.push(zimletData);
				}

				return res(
					ctx.status(200),
					ctx.json(originalResponseData)
				);
				*/
			})
		);
	}
	return handlers;
}
