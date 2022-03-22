/* eslint-disable @typescript-eslint/ban-types */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export type Tag = {
	color?: number;
	id: string;
	name: string;
	rgb?: string;
};

export type Tags = Record<string, Tag>;

export type TagState = {
	tags: Tags;
};
