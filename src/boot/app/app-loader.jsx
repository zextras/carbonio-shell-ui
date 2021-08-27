import { useState, useEffect } from 'react';
import { loadApps, unloadAllApps } from './load-apps';
import { useUserAccount } from '../account/hooks';
import { useStoreFactory } from '../bootstrapper-context';

export function AppLoader() {
	const account = useUserAccount();
	const storeFactory = useStoreFactory();
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	useEffect(() => {
		console.log(
			'%cLOADING APPS',
			'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
		);
		if (account) {
			unloadAllApps();
		} else {
			loadApps(storeFactory);
		}
	}, [account, storeFactory]);
	return null;
}
