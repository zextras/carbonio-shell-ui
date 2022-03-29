/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { SoapNotify, SoapRefresh } from '../network';
import { Tags } from '../tags';

export type SyncNotifyMessage<T> = {
	op: 'notify';
	notify: SoapNotify;
	state: T;
};

export type SyncRefreshMessage<T> = {
	op: 'refresh';
	tags: Tag[];
	state?: T;
};

export type SyncMessage<T> = SyncNotifyMessage<T> | SyncRefreshMessage<T>;

export type WorkerMessage<T> = { data: SyncMessage<T> };

export type TagMessage = WorkerMessage<Tags>;
