/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { setupServer } from 'msw/node';

import handlers from './handlers';

const server = setupServer(...handlers);
export default server;
