/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { type ReactElement, useMemo } from 'react';

import {
	type ByRoleMatcher,
	type ByRoleOptions,
	type GetAllBy,
	queries,
	queryHelpers,
	render,
	type RenderOptions,
	type RenderResult,
	screen,
	within
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import i18next, { type i18n } from 'i18next';
import { filter } from 'lodash';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '../boot/theme-provider';

export type UserEvent = ReturnType<(typeof userEvent)['setup']> & {
	readonly rightClick: (target: Element) => Promise<void>;
};

type ByRoleWithIconOptions = ByRoleOptions & {
	icon: string | RegExp;
};
/**
 * Matcher function to search an icon button through the icon data-testid
 */
const queryAllByRoleWithIcon: GetAllBy<[ByRoleMatcher, ByRoleWithIconOptions]> = (
	container,
	role,
	{ icon, ...options }
) =>
	filter(
		screen.queryAllByRole('button', options),
		(element) => within(element).queryByTestId(`icon: ${icon}`) !== null
	);
const getByRoleWithIconMultipleError = (
	container: Element | null,
	role: ByRoleMatcher,
	options: ByRoleWithIconOptions
): string => `Found multiple elements with role ${role} and icon ${options.icon}`;
const getByRoleWithIconMissingError = (
	container: Element | null,
	role: ByRoleMatcher,
	options: ByRoleWithIconOptions
): string => `Unable to find an element with role ${role} and icon ${options.icon}`;

const [
	queryByRoleWithIcon,
	getAllByRoleWithIcon,
	getByRoleWithIcon,
	findAllByRoleWithIcon,
	findByRoleWithIcon
] = queryHelpers.buildQueries<[ByRoleMatcher, ByRoleWithIconOptions]>(
	queryAllByRoleWithIcon,
	getByRoleWithIconMultipleError,
	getByRoleWithIconMissingError
);

const customQueries = {
	// byRoleWithIcon
	queryByRoleWithIcon,
	getAllByRoleWithIcon,
	getByRoleWithIcon,
	findAllByRoleWithIcon,
	findByRoleWithIcon
};

const getAppI18n = (): i18n => {
	const newI18n = i18next.createInstance();
	newI18n
		// init i18next
		// for all options read: https://www.i18next.com/overview/configuration-options
		.init({
			lng: 'en',
			fallbackLng: 'en',
			debug: false,

			interpolation: {
				escapeValue: false // not needed for react as it escapes by default
			},
			resources: { en: { translation: {} } }
		});
	return newI18n;
};

interface WrapperProps {
	children?: React.ReactNode | undefined;
	initialRouterEntries?: string[];
}

export const I18NextTestProvider = ({
	children
}: {
	children: React.ReactNode;
}): React.JSX.Element => {
	const i18nInstance = useMemo(() => getAppI18n(), []);

	return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

const Wrapper = ({ initialRouterEntries, children }: WrapperProps): React.JSX.Element => (
	<MemoryRouter
		initialEntries={initialRouterEntries}
		initialIndex={(initialRouterEntries?.length || 1) - 1}
	>
		<I18NextTestProvider>
			<ThemeProvider>
				<SnackbarManager>
					<ModalManager>{children}</ModalManager>
				</SnackbarManager>
			</ThemeProvider>
		</I18NextTestProvider>
	</MemoryRouter>
);

function customRender(
	ui: React.ReactElement,
	{
		initialRouterEntries = ['/'],
		...options
	}: WrapperProps & {
		options?: Omit<RenderOptions, 'queries' | 'wrapper'>;
	} = {}
): RenderResult<typeof queries & typeof customQueries> {
	return render(ui, {
		wrapper: ({ children }: Pick<WrapperProps, 'children'>) => (
			<Wrapper initialRouterEntries={initialRouterEntries}>{children}</Wrapper>
		),
		queries: { ...queries, ...customQueries },
		...options
	});
}

type SetupOptions = Pick<WrapperProps, 'initialRouterEntries'> & {
	renderOptions?: Omit<RenderOptions, 'queries'>;
	setupOptions?: Parameters<(typeof userEvent)['setup']>[0];
};

const setupUserEvent = (options: SetupOptions['setupOptions']): UserEvent => {
	const user = userEvent.setup(options);
	const rightClick = (target: Element): Promise<void> =>
		user.pointer({ target, keys: '[MouseRight]' });

	return {
		...user,
		rightClick
	};
};

export const setup = (
	ui: ReactElement,
	options?: SetupOptions
): { user: UserEvent } & ReturnType<typeof customRender> => ({
	user: setupUserEvent({ advanceTimers: jest.advanceTimersByTime, ...options?.setupOptions }),
	...customRender(ui, {
		initialRouterEntries: options?.initialRouterEntries,
		...options?.renderOptions
	})
});

export function controlConsoleError(expectedMessage: string): void {
	// eslint-disable-next-line no-console
	const actualConsoleError = console.error;
	// eslint-disable-next-line no-console
	console.error = jest.fn<ReturnType<typeof console.error>, Parameters<typeof console.error>>(
		(error, ...restParameter) => {
			if (
				(typeof error === 'string' && error === expectedMessage) ||
				(error instanceof Error && error.message === expectedMessage)
			) {
				// eslint-disable-next-line no-console
				console.error('Controlled error', error, ...restParameter);
			} else {
				actualConsoleError(error, ...restParameter);
			}
		}
	);
}
