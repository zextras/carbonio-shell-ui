/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMediaQuery, useTheme } from '@mui/material';

export const useMobileView = (): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.down('xs'));
};

export const BREAKPOINT_SIZE = {
	XXS: 4,
	XS: 3.5,
	SM: 3,
	MD: 2.5,
	LG: 2,
	XL: 1.5,
	XXL: 1
};
