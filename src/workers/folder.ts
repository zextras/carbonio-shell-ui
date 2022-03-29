/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	BaseFolder,
	Folder,
	Folders,
	LinkFolder,
	LinkFolderFields,
	SoapFolder,
	SoapLink
} from '../../types';

const folders: Folders = {};

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

const processLink = (
	soapLink: SoapLink,
	depth: number,
	parent?: Folder | LinkFolder
): LinkFolder => {
	const link = {
		...normalizeLink(soapLink),
		isLink: true,
		children: [],
		parent,
		depth
	} as LinkFolder;
	// eslint-disable-next-line no-param-reassign
	folders[soapLink.id] = link;
	soapLink?.folder?.forEach((f) => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		const child = processFolder(f, depth + 1, link);
		link.children.push(child);
	});
	soapLink?.link?.forEach((l) => {
		const child = processLink(l, depth + 1, link);
		link.children.push(child);
	});
	return link;
};

const processFolder = (
	soapFolder: SoapFolder,
	depth: number,
	parent?: Folder | LinkFolder
): Folder => {
	const folder: Folder = {
		...normalize(soapFolder),
		isLink: false,
		children: [],
		parent,
		depth
	};
	// eslint-disable-next-line no-param-reassign
	folders[soapFolder.id] = folder;
	soapFolder?.folder?.forEach((f) => {
		const child = processFolder(f, depth + 1, folder);
		folder.children.push(child);
	});
	soapFolder?.link?.forEach((l) => {
		const child = processLink(l, depth + 1, folder);
		folder.children.push(child);
	});
	return folder;
};

const handleFolderRefresh = (soapFolders: Array<SoapFolder>): Folder =>
	processFolder(soapFolders[0], 0);

onmessage = ({ data }: any): void => {
	if (data.op === 'refresh' && data.folder) {
		console.log(handleFolderRefresh(data.folder));
		console.log(folders);
	}
	// postMessage({ folders: handleFolderRefresh(data.folder) });
	// if (data.op === 'notify') postMessage({ folders: handleTagNotify(data.notify, data.state) });
};
