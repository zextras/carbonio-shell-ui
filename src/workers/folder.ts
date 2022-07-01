/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	BaseFolder,
	UserFolder,
	FolderMessage,
	Folders,
	LinkFolder,
	LinkFolderFields,
	Roots,
	Searches,
	SearchFolderFields,
	SoapFolder,
	SoapLink,
	SoapNotify,
	SoapSearchFolder,
	Folder
} from '../../types';

const IM_LOGS = '14';
const ROOT_NAME = 'USER_ROOT';
const DEFAULT_ROOT = 'USER';

const folders: Folders = {};
const roots: Roots = {};
const searches: Searches = {};

const omit = ({
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	link: _1,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	folder: _2,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	search: _3,
	...obj
}: Partial<SoapFolder>): Partial<SoapFolder> => obj;

const hasId = (f: SoapFolder, id: string): boolean => f.id.split(':').includes(id);
const normalize = (f: SoapFolder): BaseFolder => ({
	id: f.id,
	uuid: f.uuid,
	name: f.name,
	absFolderPath: f.absFolderPath,
	l: f.l,
	luuid: f.luuid,
	f: f.f,
	color: f.color,
	rgb: f.rgb,
	u: f.u,
	i4u: f.i4u,
	view: f.view,
	rev: f.rev,
	ms: f.ms,
	md: f.md,
	n: f.n,
	i4n: f.i4n,
	s: f.s,
	i4ms: f.i4ms,
	i4next: f.i4next,
	url: f.url,
	activesyncdisabled: !!f.activesyncdisabled,
	webOfflineSyncDays: f.webOfflineSyncDays,
	perm: f.perm,
	recursive: !!f.recursive,
	rest: f.rest,
	deletable: !!f.deletable,
	meta: f.meta,
	acl: f.acl,
	retentionPolicy: f.retentionPolicy
});

const normalizeSearch = (s: SoapSearchFolder): BaseFolder & SearchFolderFields => ({
	...normalize(s),
	query: s.query,
	sortBy: s.sortBy,
	types: s.types
});

const normalizeLink = (l: SoapLink): BaseFolder & LinkFolderFields => ({
	...normalize(l),
	owner: l.owner,
	zid: l.zid,
	rid: l.rid,
	ruuid: l.ruuid,
	oname: l.oname,
	reminder: !!l.reminder,
	broken: !!l.broken
});

const processSearch = (soapSearch: SoapSearchFolder, parent: Folder): void => {
	const search = {
		...normalizeSearch(soapSearch),
		parent,
		isLink: parent?.isLink
	};
	searches[search.id] = search;
};

const processLink = (soapLink: SoapLink, depth: number, parent?: Folder): LinkFolder => {
	const link = {
		...normalizeLink(soapLink),
		isLink: true,
		children: [],
		parent,
		depth
	} as LinkFolder;
	// eslint-disable-next-line no-param-reassign
	folders[soapLink.id] = link;
	if (link.oname === ROOT_NAME) {
		roots[link.owner ?? 'unknown'] = link;
	}
	soapLink?.folder?.forEach((f) => {
		if (!hasId(f, IM_LOGS)) {
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			const child = processFolder(f, depth + 1, link);
			link.children.push(child);
		}
	});
	soapLink?.link?.forEach((l) => {
		if (!hasId(l, IM_LOGS)) {
			const child = processLink(l, depth + 1, link);
			link.children.push(child);
		}
	});
	soapLink?.search?.forEach((s) => {
		processSearch(s, link);
	});

	return link;
};

const processFolder = (soapFolder: SoapFolder, depth: number, parent?: Folder): UserFolder => {
	const folder: UserFolder = {
		...normalize(soapFolder),
		isLink: false,
		children: [],
		parent,
		depth
	};
	folders[soapFolder.id] = folder;
	if (folder.name === ROOT_NAME) {
		roots[DEFAULT_ROOT] = folder;
	}
	soapFolder?.folder?.forEach((f) => {
		if (!hasId(f, IM_LOGS)) {
			const child = processFolder(f, depth + 1, folder);
			folder.children.push(child);
		}
	});
	soapFolder?.link?.forEach((l) => {
		if (!hasId(l, IM_LOGS)) {
			const child = processLink(l, depth + 1, folder);
			folder.children.push(child);
		}
	});
	soapFolder?.search?.forEach((s) => {
		processSearch(s, folder);
	});
	return folder;
};

const handleFolderRefresh = (soapFolders: Array<SoapFolder>): UserFolder =>
	processFolder(soapFolders[0], 0);

export const handleFolderCreated = (created: Array<SoapFolder>): void =>
	created.forEach((val: SoapFolder) => {
		if (val.id && val.l) {
			const parent = folders[val.l];
			const folder: UserFolder = {
				...normalize(val),
				isLink: false,
				children: [],
				parent,
				depth: parent?.depth ? parent.depth + 1 : 0
			};
			folders[val.id] = folder;
			parent.children.push(folder);
		}
	});
export const handleFolderModified = (modified: Array<Partial<UserFolder>>): void =>
	modified.forEach((val: Partial<SoapFolder>): void => {
		if (val.id) {
			const folder = folders[val.id];
			if (folder) {
				Object.assign(folder, omit(val));
				if (val.l) {
					const oldParent = folders[val.id].parent;
					const newParent = folders[val.l];
					if (oldParent) {
						oldParent.children = oldParent.children.filter((f) => f.id !== val.id);
						newParent.children.push(folder);
					}
					folder.parent = newParent;
				}
				folders[val.id] = folder;
			}
		}
	});
export const handleFolderDeleted = (deleted: string[]): void =>
	deleted.forEach((val) => {
		const folder = folders[val];
		if (folder) {
			if (folder.parent) {
				folder.parent.children = folder.parent.children.filter((f) => f.id !== val);
			}
			delete folders[val];
			delete roots[val];
			delete searches[val];
		}
	});
export const handleFolderNotify = (notify: SoapNotify): void => {
	handleFolderCreated(notify.created?.folder ?? []);
	handleFolderModified(notify.modified?.folder ?? []);
	handleFolderDeleted(notify.deleted ?? []);
};
onmessage = ({ data }: FolderMessage): void => {
	if (data.op === 'refresh' && data.folder) {
		handleFolderRefresh(data.folder);
	}
	if (data.op === 'notify') {
		handleFolderNotify(data.notify);
	}
	postMessage({ folders, roots, searches });
};
