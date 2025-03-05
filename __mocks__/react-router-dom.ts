/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const actualReactRouterDom = jest.requireActual('react-router-dom');

module.exports = {
	...actualReactRouterDom,
	useBlocker: jest.fn().mockImplementation(() => ({
		state: 'unblocked',
		proceed: jest.fn()
	}))
};
