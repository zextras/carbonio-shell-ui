/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { reduce } from 'lodash';
import { SoapFolder } from '../../types';

type TempFolders = { [id: string]: SoapFolder };

const processFolders = (soapFolders: Array<SoapFolder>, folderMap: TempFolders): TempFolders =>
	reduce(
		soapFolders,
		(acc, val) => {
			// eslint-disable-next-line no-param-reassign
			acc[val.id] = val;
			if (val.folder) {
				processFolders(val.folder, acc);
			}
			return acc;
		},
		folderMap
	);
export const handleFolderRefresh = (folders: Array<SoapFolder>): TempFolders =>
	processFolders(folders, {});

onmessage = ({ data }: any): void => {
	if (data.op === 'refresh' && data.folder) console.log(handleFolderRefresh(data.folder));
	// postMessage({ folders: handleFolderRefresh(data.folder) });
	// if (data.op === 'notify') postMessage({ folders: handleTagNotify(data.notify, data.state) });
};
