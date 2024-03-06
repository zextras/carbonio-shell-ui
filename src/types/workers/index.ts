/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { SoapNotify, SoapRefresh } from '../network';
import type { Tags } from '../tags';

export type SyncNotifyMessage = {
	op: 'notify';
	notify: SoapNotify;
};

export type SyncRefreshMessage = SoapRefresh & {
	op: 'refresh';
};

export type SyncMessage = SyncNotifyMessage | SyncRefreshMessage;

export type WorkerMessage<T> = { data: SyncMessage & T };

export type TagMessage = WorkerMessage<{ state: Tags }>;

export type FolderMessage = WorkerMessage<Record<string, never>>;
