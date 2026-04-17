/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { ReactNode } from 'react';

import { useAuthenticated } from '../store/account';

export type AuthGuardProps = {
	children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardProps): ReactNode => {
	const isAuthenticated = useAuthenticated();

	return isAuthenticated ? <>{children}</> : null;
};
