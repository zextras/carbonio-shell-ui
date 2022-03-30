/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { forEach } from 'lodash';
import { SoapContext } from '../../../types';

// import { map, maxBy } from 'lodash';
// import { SoapContext } from '../../../types';
// import { getSoapFetch } from '../../network/fetch';
// import { useNetworkStore } from './store';

import { folderWorker, tagWorker } from '../../workers';
import { useFolderStore } from '../folder';
import { useTagStore } from '../tags';
import { useNetworkStore } from './store';

export const handleSync = ({ refresh, notify }: SoapContext): Promise<void> =>
	new Promise((r) => {
		const { seq } = useNetworkStore.getState();
		if (refresh) {
			tagWorker.postMessage({
				op: 'refresh',
				tags: refresh.tags?.tag ?? []
			});
			folderWorker.postMessage({
				op: 'refresh',
				folder: refresh.folder ?? []
			});
		}
		if (notify?.length) {
			forEach(notify, (item) => {
				if (item.seq > seq) {
					tagWorker.postMessage({
						op: 'notify',
						notify: item,
						state: useTagStore.getState().tags
					});
					folderWorker.postMessage({
						op: 'notify',
						notify: item,
						state: useFolderStore.getState()
					});
				}
			});
		}
		r();
	});
// export const noOp = (): void => {
// 	// eslint-disable-next-line @typescript-eslint/no-use-before-define
// 	getSoapFetch(SHELL_APP_ID)(
// 		'NoOp',
// 		useNetworkStore.getState().pollingInterval === 500
// 			? { _jsns: 'urn:zimbraMail', limitToOneBlocked: 1, wait: 1 }
// 			: { _jsns: 'urn:zimbraMail' }
// 	);
// };
// export const handleSoapContext = ({ notify, refresh, session, change }: SoapContext): void =>
// 	useNetworkStore.setState({
// 		session,
// 		change,
// 		refresh,
// 		seq: maxBy(notify, 'seq'),
// 		noOpTimeout: setTimeout(() => noOp(), pollingInterval),
// 		notify: map(notify, (notifyItem) => ({
// 			...notifyItem,
// 			deleted: notifyItem.deleted?.id?.split(',')
// 		}))
// 	});
// // handleTagSync(_context);
// // useNetworkStore.setState({
// // 	noOpTimeout: setTimeout(() => noOp(), pollingInterval),
// // 	,
// // 	...res?.Header?.context
// // });
