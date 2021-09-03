import { useState, useEffect } from 'react';
import { loadApps, unloadAllApps } from './load-apps';
import { useUserAccount } from '../../store/account/hooks';
import { useStoreFactory } from '../bootstrapper-context';
import { useAppList } from '../../store/app/hooks';

export function AppLoader() {
	const apps = useAppList();
	const storeFactory = useStoreFactory();
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	useEffect(() => {
		if (apps.length > 0) {
			console.log(
				'%cLOADING APPS',
				'color: white; background: #2b73d2;padding: 4px 8px 2px 4px; font-family: sans-serif; border-radius: 12px; width: 100%'
			);
			loadApps(storeFactory, apps);
		}
		return () => {
			unloadAllApps();
		};
	}, [apps, storeFactory]);
	return null;
}
