/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import styled from '@emotion/styled';
import { Catcher, Container, Padding } from '@zextras/carbonio-design-system';

import { CreationButton } from './creation-button';
import { Logo } from './logo';
import { BOARD_CONTAINER_ZINDEX, HEADER_BAR_HEIGHT } from '../constants';
import { useDarkMode } from '../dark-mode/use-dark-mode';
import { useIntegratedComponent } from '../store/integrations/hooks';

const StyledLogo = styled(Logo)`
	height: 2rem;
`;

const ShellHeaderContainer = styled(Container)`
	z-index: ${BOARD_CONTAINER_ZINDEX + 1};
`;

interface ShellHeaderProps {
	children: React.ReactNode | React.ReactNode[];
}

const ShellHeader = ({ children }: ShellHeaderProps): React.JSX.Element => {
	const { darkReaderStatus } = useDarkMode();

	const [SearchBar, isSearchBarAvailable] = useIntegratedComponent('search-bar');

	const [TotalQuotaUsage, isTotalQuotaUsageAvailable] = useIntegratedComponent('total-quota-usage');
	return (
		<ShellHeaderContainer
			data-testid="MainHeaderContainer"
			orientation="horizontal"
			background={'gray3'}
			width="fill"
			height={HEADER_BAR_HEIGHT}
			minHeight={HEADER_BAR_HEIGHT}
			maxHeight={HEADER_BAR_HEIGHT}
			mainAlignment="space-between"
			padding={{
				horizontal: 'large',
				vertical: 'small'
			}}
		>
			<Catcher>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					minWidth="fit-content"
					data-testid="HeaderMainLogoContainer"
				>
					<Container width="15.625rem" height="2rem" crossAlignment="flex-start">
						{darkReaderStatus && <StyledLogo />}
					</Container>
					<Padding horizontal="large">
						<CreationButton />
					</Padding>
					{isSearchBarAvailable && (
						<Catcher>
							<SearchBar />
						</Catcher>
					)}
				</Container>
				<Container
					orientation="horizontal"
					width="auto"
					mainAlignment="flex-end"
					padding={{ left: 'small' }}
				>
					{isTotalQuotaUsageAvailable && (
						<Container
							data-testid="TotalQuotaUsageContainer"
							height={'3.125rem'}
							borderColor={{ left: 'gray2' }}
							padding={{ horizontal: 'large', vertical: 'small' }}
						>
							<Catcher>
								<TotalQuotaUsage />
							</Catcher>
						</Container>
					)}
					{children}
				</Container>
			</Catcher>
		</ShellHeaderContainer>
	);
};
export default ShellHeader;
