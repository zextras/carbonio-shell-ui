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

import { rest } from 'msw';
import faker from 'faker';
import { RequestHandlersList } from 'msw/lib/types/setupWorker/glossary';

function getCompleteUrl(api: string): string {
	return `/service/soap/${api}Request`;
}

function getCompleteResponse(api: string, response: any): any {
	return {
		Body: {
			[`${api}Response`]: response,
		},
	};
}

export function generateHandlers(cliSettings: any): RequestHandlersList {
	console.log('CLI Settings', cliSettings);
	return [
		rest.post(getCompleteUrl('Auth'), (req, res, ctx) => res(
			ctx.status(200),
			ctx.json(getCompleteResponse('Auth', {
				csrfToken: {
					_content: `0_${faker.random.alphaNumeric(40)}`
				},
				authToken: [{
					_content: `0_${faker.random.hexaDecimal(327)}`
				}],
				lifetime: 35999999,
				// skin: [{ _content: 'tree' }],
				prefs: {
					_attrs: {
						zimbraPrefMailPollingInterval: '500'
					}
				}
			})),
		)),
		rest.post(getCompleteUrl('GetInfo'), (req, res, ctx) => {
			const zimletData = {
				description: `${cliSettings.app_package.description}`,
				zapp: 'true',
				'zapp-main': 'app.bundle.js',
				label: `${cliSettings.app_package.label}`,
				name: `${cliSettings.app_package.name}`,
				version: `${cliSettings.app_package.version}`
			};
			if (cliSettings.hasHandlers) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				zimletData['zapp-handlers'] = 'handlers.bundle.js';
			}
			return res(
				ctx.status(200),
				ctx.json(getCompleteResponse('GetInfo', {
					id: faker.random.uuid(),
					name: faker.internet.email(),
					zimlets: {
						zimlet: [
							{
								zimletContext: [
									{
										baseUrl: '/service/zimlet/com_zextras_zapp_default_theme/',
										priority: 0,
										presence: 'enabled'
									}
								],
								zimlet: [
									{
										description: 'Default Zextras Theme',
										label: 'Default Zextras Theme',
										name: 'com_zextras_theme_default',
										version: '0.0.0',
										zapp: 'true',
										'zapp-theme': 'theme.bundle.js'
									}
								]
							},
							{
								zimletContext: [{
									baseUrl: `/service/zimlet/${cliSettings.app_package.package}/`,
									priority: 1,
									presence: 'enabled'
								}],
								zimlet: [zimletData],
							}
						],
					},
					attrs: {
						_attrs: {
							displayName: `${faker.name.firstName()} ${faker.name.lastName()}`
						}
					},
				})),
			);
		}),
	];
}
