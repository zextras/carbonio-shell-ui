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
			loadApps(storeFactory, apps);
		}
		return () => {
			unloadAllApps();
		};
	}, [apps, storeFactory]);
	return null;
}
