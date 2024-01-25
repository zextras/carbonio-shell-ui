/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { HttpResponse, HttpResponseResolver } from 'msw';

import { LoginConfigStore } from '../../../types/loginConfig';

export const getLoginConfig: HttpResponseResolver<
	never,
	never,
	Partial<Omit<LoginConfigStore, 'loaded'>>
> = () =>
	HttpResponse.json({
		carbonioWebUiTitle: 'Carbonio Client',
		carbonioWebUiFavicon: `${BASE_PATH}favicon.png`
	});
