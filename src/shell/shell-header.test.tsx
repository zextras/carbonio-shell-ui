/*
 * SPDX-FileCopyrightText: 2026 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import ShellHeader from './shell-header';
import { useIntegrationsStore } from '../store/integrations/store';
import { setup, screen } from '../tests/utils';

describe('ShellHeader', () => {
	it('should render ShellHeader component', () => {
		setup(
			<ShellHeader>
				<></>
			</ShellHeader>
		);
		const headerElement = screen.getByTestId('MainHeaderContainer');
		expect(headerElement, 'the ShellHeader main container should be rendered').toBeInTheDocument();
	});

	it('should render children correctly', () => {
		setup(
			<ShellHeader>
				<div data-testid="ChildElement">Child Content</div>
			</ShellHeader>
		);
		const childElement = screen.getByTestId('ChildElement');
		expect(
			childElement,
			'the child element passed to ShellHeader should be rendered'
		).toBeInTheDocument();
		expect(childElement, 'the child element should display its provided content').toHaveTextContent(
			'Child Content'
		);
	});

	it('should render the total quota component if available', () => {
		useIntegrationsStore.setState(
			(state) => ({
				...state,
				components: {
					'total-quota-usage': {
						app: 'test-app',
						Item: vi.fn()
					}
				}
			}),
			true
		);

		setup(<ShellHeader>{null}</ShellHeader>);

		expect(
			screen.getByTestId('TotalQuotaUsageContainer'),
			'the total quota usage component should be visible when registered in the store'
		).toBeVisible();
	});

	it('should not render the total quota component if not available', () => {
		setup(<ShellHeader>{null}</ShellHeader>);

		expect(
			screen.queryByTestId('TotalQuotaUsageContainer'),
			'the total quota usage component should not be rendered when not registered in the store'
		).not.toBeInTheDocument();
	});
});
