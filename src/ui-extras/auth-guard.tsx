/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import type { ReactNode } from 'react';
import React from 'react';

import { useAuthenticated } from '../store/account';

type AuthGuardProps = {
	children: ReactNode;
};

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
	const isAuthenticated = useAuthenticated();

	return isAuthenticated ? <>{children}</> : null;
};
