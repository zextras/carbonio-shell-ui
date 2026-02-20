/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
	Container,
	Divider,
	getColor,
	Icon,
	Padding,
	Row,
	Select,
	Text
} from '@zextras/carbonio-design-system';
import type {
	SelectItem,
	LabelFactoryProps,
	SingleSelectionOnChange
} from '@zextras/carbonio-design-system';

interface SelectWithErrorProps {
	items: SelectItem[];
	selectLabel: string;
	onChange: SingleSelectionOnChange;
	selection: SelectItem;
	hasError?: boolean;
	errorMessage?: string;
}

const Label = styled(Text)<{ $selected: boolean }>`
	position: absolute;
	top: ${({ $selected, theme }): string =>
		$selected ? `calc(${theme.sizes.padding.small} - 0.0625rem)` : '50%'};
	left: ${({ theme }): string => theme.sizes.padding.large};
	transform: translateY(${({ $selected }): string => ($selected ? '0' : '-50%')});
	transition: 150ms ease-out;
`;

const CustomText = styled(Text)`
	min-height: 1.167em;
`;

const CustomIcon = styled(Icon)`
	align-self: center;
	pointer-events: none;
`;

const ContainerEl = styled(Container)<{ $focus: boolean }>`
	transition: background 0.2s ease-out;
	&:hover {
		background: ${({ theme, background }): string => getColor(`${background}.hover`, theme)};
	}
	${({ $focus, theme, background }): ReturnType<typeof css> | false =>
		$focus &&
		css`
			background: ${getColor(`${background}.focus`, theme)};
		`};
`;

function createLabelFactory(hasError?: boolean) {
	return function LabelFactoryWithError({
		selected,
		label,
		open,
		focus,
		background,
		disabled
	}: LabelFactoryProps): React.JSX.Element {
		const selectedLabels = useMemo(
			() => selected.reduce<string[]>((arr, obj) => [...arr, obj.label], []).join(', '),
			[selected]
		);

		const color = useMemo(() => {
			if (hasError) {
				return 'error';
			}
			if (disabled) {
				return 'gray2';
			}
			if (open || focus) {
				return 'primary';
			}
			return 'secondary';
		}, [disabled, focus, open]);

		const dividerColor = useMemo(() => {
			if (hasError) {
				return 'error';
			}
			if (open || focus) {
				return 'primary';
			}
			return 'gray3';
		}, [focus, open]);

		return (
			<>
				<ContainerEl
					orientation="horizontal"
					width="fill"
					crossAlignment="flex-end"
					mainAlignment="space-between"
					borderRadius="half"
					padding={{
						horizontal: 'large',
						vertical: 'small'
					}}
					background={background}
					$focus={focus}
				>
					<Row takeAvailableSpace mainAlignment="unset">
						<Padding top="medium" width="100%">
							<CustomText size="medium" color={disabled ? 'secondary' : 'text'}>
								{selectedLabels}
							</CustomText>
						</Padding>
						<Label
							$selected={selected.length > 0}
							size={selected.length > 0 ? 'small' : 'medium'}
							color={color}
						>
							{label}
						</Label>
					</Row>
					<CustomIcon size="medium" icon={open ? 'ArrowUp' : 'ArrowDown'} color={color} />
				</ContainerEl>
				<Divider color={dividerColor} />
			</>
		);
	};
}

export const SelectWithError = ({
	items,
	selectLabel,
	onChange,
	selection,
	hasError,
	errorMessage,
	...rest
}: SelectWithErrorProps): React.JSX.Element => {
	const LabelFactory = useMemo(() => createLabelFactory(hasError), [hasError]);

	return (
		<Container gap={'0.5rem'} crossAlignment={'flex-start'} height={'fit'} {...rest}>
			<Select
				items={items}
				label={selectLabel}
				onChange={onChange}
				selection={selection}
				showCheckbox={false}
				LabelFactory={LabelFactory}
			/>
			{hasError && (
				<Text color="error" size="small">
					{errorMessage}
				</Text>
			)}
		</Container>
	);
};
