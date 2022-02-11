/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useMemo } from 'react';
import { ShellModes } from '../../types';

export const ShellMode: FC<{ include?: ShellModes[]; exclude?: ShellModes[] }> = ({
	include,
	exclude,
	children
}) => {
	const pass = useMemo(() => {
		if (include) {
			return include.includes(__SHELL_ENV__);
		}
		if (exclude) {
			return !exclude.includes(__SHELL_ENV__);
		}
		return false;
	}, [exclude, include]);

	return pass ? <>{children}</> : null;
};
