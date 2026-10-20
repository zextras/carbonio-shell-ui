/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { act, fireEvent } from '@testing-library/react';

import ShellSecondaryBar from './shell-secondary-bar';
import {
	LOCAL_STORAGE_SECONDARY_BAR_WIDTH,
	SECONDARY_BAR_WIDTH
} from '../constants/internal-constants';
import { useAppStore } from '../store/app';
import { setup, screen } from '../tests/utils';
import type { AppRouteDescriptor, SecondaryBarComponentProps } from '../types/apps';
import { useUtilityBarStore } from '../utility-bar/store';

const TestComponent = ({ expanded }: SecondaryBarComponentProps): React.JSX.Element => (
	<>
		<div>test component</div>
		<div>{expanded ? 'expanded' : 'collapsed'}</div>
	</>
);
const AppViewComponent = (): React.JSX.Element => <div>app view component</div>;

document.documentElement.style.fontSize = '16px';
const ROOT_FONT_SIZE = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
const DEFAULT_WIDTH_PX = SECONDARY_BAR_WIDTH.default * ROOT_FONT_SIZE;
const COLLAPSED_WIDTH_PX = SECONDARY_BAR_WIDTH.collapsed * ROOT_FONT_SIZE;

function addTestRoute(route: Partial<AppRouteDescriptor> = {}): void {
	useAppStore.getState().addRoute({
		id: 'test',
		route: 'test',
		position: 2,
		visible: true,
		label: 'Test',
		primaryBar: 'DriveOutline',
		appView: AppViewComponent,
		secondaryBar: TestComponent,
		badge: { show: false },
		app: 'carbonio-test-ui',
		...route
	});
}

function getSavedWidth(): unknown {
	return JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_SECONDARY_BAR_WIDTH) ?? 'null');
}

function setSavedWidth(value: unknown): void {
	window.localStorage.setItem(LOCAL_STORAGE_SECONDARY_BAR_WIDTH, JSON.stringify(value));
}

function expectSidebarWidth(widthInRem: number): void {
	expect(screen.getByTestId('SideSecondaryBarContainer')).toHaveStyleRule(
		'width',
		`${widthInRem}rem`
	);
}

/**
 * Drag the divider until the pointer is at the given x, starting from a sidebar with the given width
 */
function dragDividerTo(targetX: number, initialWidth = DEFAULT_WIDTH_PX): void {
	const sidebar = screen.getByTestId('SideSecondaryBarContainer');
	vi.spyOn(sidebar, 'getBoundingClientRect').mockReturnValue({ width: initialWidth } as DOMRect);
	const divider = screen.getByRole('separator');
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseDown(divider, { button: 0, clientX: initialWidth });
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseMove(document.body, { clientX: targetX });
	// eslint-disable-next-line testing-library/prefer-user-event
	fireEvent.mouseUp(document.body);
}

describe('ShellSecondaryBar', () => {
	it('should render the secondary bar component on proper route', () => {
		addTestRoute();
		setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
		expect(
			screen.getByText('test component'),
			'the secondary bar component should be visible when on the matching route'
		).toBeVisible();
	});
	it('should not render the secondary bar component on wrong route', () => {
		addTestRoute();
		setup(<ShellSecondaryBar />, { initialRouterEntries: ['/wrong'] });
		expect(
			screen.queryByText('test component'),
			'the secondary bar component should not be rendered when on a non-matching route'
		).not.toBeInTheDocument();
	});

	describe('Resize', () => {
		it('should render the divider and start expanded at the default width', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			expect(screen.getByRole('separator')).toBeVisible();
			expectSidebarWidth(SECONDARY_BAR_WIDTH.default);
			expect(screen.getByText('expanded')).toBeVisible();
			expect(getSavedWidth()).toBeNull();
		});

		it('should resize the bar and save the width in the local storage', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			const targetX = DEFAULT_WIDTH_PX + 50;
			dragDividerTo(targetX);
			const expectedWidth = targetX / ROOT_FONT_SIZE;
			expect(getSavedWidth()).toBe(expectedWidth);
			expectSidebarWidth(expectedWidth);
			expect(screen.getByText('expanded')).toBeVisible();
		});

		it('should not grow over the max width', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			dragDividerTo(2000);
			expect(getSavedWidth()).toBe(SECONDARY_BAR_WIDTH.max);
		});

		it('should stop at the min width when dragged between the collapse threshold and the min width', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			dragDividerTo(
				((SECONDARY_BAR_WIDTH.collapseThreshold + SECONDARY_BAR_WIDTH.min) / 2) * ROOT_FONT_SIZE
			);
			expect(getSavedWidth()).toBe(SECONDARY_BAR_WIDTH.min);
			expect(screen.getByText('expanded')).toBeVisible();
		});

		it('should collapse to the icons-only width when dragged under the collapse threshold', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			dragDividerTo(SECONDARY_BAR_WIDTH.collapseThreshold * ROOT_FONT_SIZE - 1);
			expect(getSavedWidth()).toBe(SECONDARY_BAR_WIDTH.collapsed);
			expectSidebarWidth(SECONDARY_BAR_WIDTH.collapsed);
			expect(screen.getByText('collapsed')).toBeVisible();
		});

		it('should expand a collapsed bar when dragged past the collapse threshold', () => {
			setSavedWidth(SECONDARY_BAR_WIDTH.collapsed);
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			expect(screen.getByText('collapsed')).toBeVisible();
			const targetX = 300;
			dragDividerTo(targetX, COLLAPSED_WIDTH_PX);
			expect(getSavedWidth()).toBe(targetX / ROOT_FONT_SIZE);
			expect(screen.getByText('expanded')).toBeVisible();
		});

		it('should not save anything if the width does not change', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			dragDividerTo(DEFAULT_WIDTH_PX);
			expect(getSavedWidth()).toBeNull();
		});

		it('should switch to the collapsed UI while dragging under the collapse threshold, before the mouse is released', () => {
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			const sidebar = screen.getByTestId('SideSecondaryBarContainer');
			vi.spyOn(sidebar, 'getBoundingClientRect').mockReturnValue({
				width: DEFAULT_WIDTH_PX
			} as DOMRect);
			const divider = screen.getByRole('separator');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(divider, { button: 0, clientX: DEFAULT_WIDTH_PX });
			expect(screen.getByText('expanded')).toBeVisible();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(document.body, {
				clientX: SECONDARY_BAR_WIDTH.collapseThreshold * ROOT_FONT_SIZE - 1
			});
			expect(screen.getByText('collapsed')).toBeVisible();
			expect(getSavedWidth()).toBeNull();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(document.body, { clientX: DEFAULT_WIDTH_PX });
			expect(screen.getByText('expanded')).toBeVisible();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseUp(document.body);
			expect(screen.getByText('expanded')).toBeVisible();
			expect(getSavedWidth()).toBeNull();
		});

		it('should switch to the expanded UI while dragging a collapsed bar past the collapse threshold, before the mouse is released', () => {
			setSavedWidth(SECONDARY_BAR_WIDTH.collapsed);
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			const sidebar = screen.getByTestId('SideSecondaryBarContainer');
			vi.spyOn(sidebar, 'getBoundingClientRect').mockReturnValue({
				width: COLLAPSED_WIDTH_PX
			} as DOMRect);
			const divider = screen.getByRole('separator');
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseDown(divider, { button: 0, clientX: COLLAPSED_WIDTH_PX });
			expect(screen.getByText('collapsed')).toBeVisible();
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseMove(document.body, { clientX: 300 });
			expect(screen.getByText('expanded')).toBeVisible();
			expect(getSavedWidth()).toBe(SECONDARY_BAR_WIDTH.collapsed);
			// eslint-disable-next-line testing-library/prefer-user-event
			fireEvent.mouseUp(document.body);
			expect(screen.getByText('expanded')).toBeVisible();
			expect(getSavedWidth()).toBe(300 / ROOT_FONT_SIZE);
		});

		it('should not expand a collapsed bar on click', async () => {
			setSavedWidth(SECONDARY_BAR_WIDTH.collapsed);
			addTestRoute();
			const { user } = setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			await user.click(screen.getByText('test component'));
			expectSidebarWidth(SECONDARY_BAR_WIDTH.collapsed);
			expect(screen.getByText('collapsed')).toBeVisible();
		});

		it('should use the saved width', () => {
			setSavedWidth(25);
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			expectSidebarWidth(25);
		});

		it('should fallback to the default width if the saved width is invalid', () => {
			setSavedWidth({ 'carbonio-test-ui': 25 });
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			expectSidebarWidth(SECONDARY_BAR_WIDTH.default);
		});

		it('should keep the saved width between min and max', () => {
			setSavedWidth(1000);
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			expectSidebarWidth(SECONDARY_BAR_WIDTH.max);
		});

		it('should collapse the bar while the utility panel is open, without changing the saved width', () => {
			setSavedWidth(25);
			addTestRoute();
			setup(<ShellSecondaryBar />, { initialRouterEntries: ['/test'] });
			act(() => {
				useUtilityBarStore.getState().setMode('open');
			});
			expectSidebarWidth(SECONDARY_BAR_WIDTH.collapsed);
			expect(screen.getByText('collapsed')).toBeVisible();
			act(() => {
				useUtilityBarStore.getState().setMode('closed');
			});
			expectSidebarWidth(25);
			expect(getSavedWidth()).toBe(25);
		});
	});
});
