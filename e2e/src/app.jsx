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

import {
	setMainMenuItems,
	setRoutes,
	setCreateOptions,
	setAppContext,
	accounts
} from '@zextras/zapp-shell';

export default function app() {
	setMainMenuItems([
		{
			app: 'App 1',
			id: 'test-app-1',
			icon: 'PeopleOutline',
			to: '/',
			label: 'Test Contact App',
			children: [
				{
					id: 'app-test-main3',
					to: '/1/',
					label: 'account-1@test.it',
					children: [
						{
							id: 'contacts',
							to: '/1/contacts/',
							label: 'Contacts',
							children: [
								{
									id: 'worklist',
									to: '/1/contacts/worklist/',
									label: 'Worklist'
								},
								{
									id: 'customers-list',
									to: '/1/contacts/customers-list/',
									label: 'Customers List'
								},
								{
									id: 'providers-list',
									to: '/1/contacts/providers-list/',
									label: 'Providers List'
								},
								{
									id: 'personal-use',
									to: '/1/contacts/personal-use/',
									label: 'Personal use'
								}
							]
						}
					]
				}
			]
		},
		{
			app: 'App 2',
			id: 'test-app-2',
			icon: 'EmailOutline',
			to: '/mails/',
			label: 'Test Mail App',
			children: [
				{
					id: 'mails',
					to: '/mails/',
					label: 'Mails'
				}
			]
		}
	]);

	setCreateOptions([
		{
			id: 'create-contact',
			label: 'New Contact',
			app: { path: '/contact/new', getPath: () => '/getPath/contacts/new' },
		},
		{
			id: 'create-mail',
			label: 'New Mail',
			app: { path: '/mail/new', boardPath: '/board/mail/new' },
		}
	]);
}
