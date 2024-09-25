/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface Action {
	label: string;
	icon?: string;
	execute(...args: unknown[]): unknown;
}

export type ActionFactory<TContext, TAction extends Action = Action> = (
	context: TContext
) => TAction;
