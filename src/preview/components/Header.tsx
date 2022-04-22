/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { IconButton, Text, Tooltip } from '@zextras/carbonio-design-system';
import map from 'lodash/map';
import styled from 'styled-components';

const HeaderContainer = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 16px;
`;

const LeftContainer = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
	gap: 8px;
`;

const RightContainer = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
`;

const InfoContainer = styled.div`
	width: fit-content;
	& div {
		line-height: 1.5;
	}
`;

const UpperCaseText = styled(Text)`
	text-transform: uppercase;
`;

interface HeaderAction {
	/** id used as key */
	id: string;
	/** Action called on click */
	onClick?: React.ReactEventHandler;
	/** Icon from the theme */
	icon: string;
	/** Label to show as tooltip for the action */
	tooltipLabel?: string;
	tooltipPlacement?: React.ComponentPropsWithRef<typeof Tooltip>['placement'];
	/** Disabled status for the action */
	disabled?: boolean;
}

export interface HeaderProps {
	/** Left Action for the preview */
	closeAction?: HeaderAction;
	/** Actions for the preview */
	actions: HeaderAction[];
	/** Extension of the file, shown as info */
	extension: string;
	/** Name of the file, shown as info */
	filename: string;
	/** Size of the file, shown as info */
	size: string;
}

const Header: React.VFC<HeaderProps> = ({ closeAction, actions, filename, extension, size }) => (
	<HeaderContainer>
		<LeftContainer>
			{closeAction && (
				<Tooltip
					label={closeAction.tooltipLabel}
					disabled={!closeAction.tooltipLabel}
					key={closeAction.id}
					placement={closeAction.tooltipPlacement}
				>
					<IconButton
						onClick={closeAction.onClick}
						icon={closeAction.icon}
						size="medium"
						backgroundColor="transparent"
						iconColor="gray6"
					/>
				</Tooltip>
			)}
			<InfoContainer>
				<Text size="small" color="gray6">
					{filename}
				</Text>
				<UpperCaseText size="small" color="gray6">
					{extension}
					{extension && size && <> &middot; </>}
					{size}
				</UpperCaseText>
			</InfoContainer>
		</LeftContainer>
		<RightContainer>
			{map(actions, ({ id, onClick, disabled, icon, tooltipLabel, tooltipPlacement }) => (
				<Tooltip
					label={tooltipLabel}
					disabled={!tooltipLabel}
					key={id}
					placement={tooltipPlacement}
				>
					<IconButton
						onClick={onClick}
						disabled={disabled}
						icon={icon}
						size="medium"
						backgroundColor="transparent"
						iconColor="gray6"
					/>
				</Tooltip>
			))}
		</RightContainer>
	</HeaderContainer>
);

export default Header;
