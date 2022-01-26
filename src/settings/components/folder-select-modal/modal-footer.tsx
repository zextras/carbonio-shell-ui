/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, ReactElement } from 'react';
import { Container, Button, Padding, Divider, Tooltip } from '@zextras/carbonio-design-system';

type ModalFooterProps = {
	mainAlignment?: string | undefined;
	crossAlignment?: string | undefined;
	padding?: Record<string, string> | undefined;
	onConfirm: (a: string) => void;
	secondaryAction?: () => void | undefined;
	label: string;
	secondaryLabel?: string | undefined;
	disabled?: boolean | undefined;
	secondaryDisabled?: boolean | undefined;
	background?: string | undefined;
	secondarybackground?: string | undefined;
	color?: string | undefined;
	secondaryColor?: string | undefined;
	size?: string | undefined;
	primaryBtnType?: string | undefined;
	secondaryBtnType?: string | undefined;
	showDivider?: boolean;
	tooltip?: string;
	secondaryTooltip?: string;
	paddingTop?: string;
};

const ModalFooter: FC<ModalFooterProps> = ({
	mainAlignment = 'center',
	crossAlignment = 'center',
	onConfirm,
	label,
	secondaryAction,
	secondaryLabel = 'Cancel',
	primaryBtnType = 'default',
	secondaryBtnType = 'default',
	disabled,
	secondaryDisabled,
	background = 'primary',
	secondarybackground,
	color = 'primary',
	secondaryColor = 'secondary',
	size = 'fit',
	showDivider = true,
	tooltip,
	secondaryTooltip,
	paddingTop = 'medium'
}): ReactElement => (
	<Container
		mainAlignment={mainAlignment}
		crossAlignment={crossAlignment}
		padding={{ top: paddingTop }}
	>
		{showDivider && <Divider />}

		<Container
			orientation="horizontal"
			padding={{ top: 'medium' }}
			mainAlignment="flex-end"
			crossAlignment="flex-end"
		>
			{secondaryAction && (
				<Padding right="small" vertical="small">
					{secondaryTooltip ? (
						<Tooltip label={secondaryTooltip} placement="top" maxWidth="fit">
							<Button
								backgroundColor={secondarybackground}
								color={secondaryColor}
								type={secondaryBtnType}
								onClick={secondaryAction}
								label={secondaryLabel}
								disabled={secondaryDisabled}
								size={size}
							/>
						</Tooltip>
					) : (
						<Button
							backgroundColor={secondarybackground}
							color={secondaryColor}
							type={secondaryBtnType}
							onClick={secondaryAction}
							label={secondaryLabel}
							disabled={secondaryDisabled}
							size={size}
						/>
					)}
				</Padding>
			)}

			<Padding vertical="small">
				{tooltip ? (
					<Tooltip label={tooltip} placement="top" maxWidth="fit">
						<Button
							size={size}
							color={color}
							onClick={onConfirm}
							label={label}
							type={primaryBtnType}
							disabled={disabled}
							backgroundColor={background}
						/>
					</Tooltip>
				) : (
					<Button
						size={size}
						color={color}
						onClick={onConfirm}
						label={label}
						type={primaryBtnType}
						disabled={disabled}
						backgroundColor={background}
					/>
				)}
			</Padding>
		</Container>
	</Container>
);
export default ModalFooter;
