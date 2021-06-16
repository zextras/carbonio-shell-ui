import React, { FC } from 'react';
import { AppData } from '../zustand/app/store-types';

const Bogus: FC<unknown> = (props: unknown) => {
	console.log(props);
	return <p>( ͡° ͜ʖ ͡°)</p>;
};

export const settingsAppData: AppData = {
	core: {
		priority: 100,
		package: 'com_zextras_zapp_settings',
		name: 'Settings',
		description: 'Settings app',
		version: '0.0.0',
		resourceUrl: '',
		entryPoint: ''
	},
	icon: 'Settings2Outline',
	views: {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		app: Bogus
	}
};
