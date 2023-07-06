/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useImperativeHandle } from 'react';
import { SettingsSectionProps } from '../components/utils';

export function useReset(ref: SettingsSectionProps['resetRef'], resetFn: () => void): void {
	useImperativeHandle(
		ref,
		() => ({
			reset: resetFn
		}),
		[resetFn]
	);
}
