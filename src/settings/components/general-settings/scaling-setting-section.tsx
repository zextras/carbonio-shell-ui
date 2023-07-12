/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
	Button,
	Checkbox,
	Container,
	Slider,
	SliderProps,
	Text,
	Tooltip
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled, { SimpleInterpolation } from 'styled-components';

import { ScalingSettings } from '../../../../types/settings';
import { BASE_FONT_SIZE, SCALING_OPTIONS } from '../../../constants';
import { useReset } from '../../hooks/use-reset';
import { getAutoScalingFontSize, ResetComponentImperativeHandler } from '../utils';

const ScalingSliderContainer = styled(Container)`
	box-shadow: 0px 0px 4px rgba(166, 166, 166, 0.5);
	border-radius: 0.5rem;
`;

const ExampleContainer = styled(Container)<{ $fontSize: number | undefined }>`
	font-size: ${({ $fontSize }): SimpleInterpolation => $fontSize && `${$fontSize}%`};
`;

const ExampleText = styled(Text)`
	font-size: 1em; /* font-size needs to be relative to ExampleContainer */
`;

interface ScalingSettingSectionProps {
	scalingSettings: ScalingSettings;
	addLocalStoreChange: (
		key: keyof ScalingSettings,
		value: ScalingSettings[keyof ScalingSettings]
	) => void;
	cleanLocalStoreChange: (key: keyof ScalingSettings) => void;
	resetRef: React.RefObject<ResetComponentImperativeHandler>;
}

const BASE_FONT_OPTION_INDEX = SCALING_OPTIONS.findIndex(
	(option) => option.value === BASE_FONT_SIZE
);

const AUTOSCALING_FONT_SIZE = getAutoScalingFontSize();
const AUTOSCALING_FONT_OPTION_INDEX = SCALING_OPTIONS.findIndex(
	(option) => option.value === AUTOSCALING_FONT_SIZE
);

export const ScalingSettingSection = ({
	scalingSettings,
	addLocalStoreChange,
	cleanLocalStoreChange,
	resetRef
}: ScalingSettingSectionProps): JSX.Element => {
	const [t] = useTranslation();

	const [scalingOptionValues, scalingOptionLabels] = useMemo<[number[], string[]]>(
		() =>
			SCALING_OPTIONS.reduce<[number[], string[]]>(
				([values, labels], option) => {
					values.push(option.value);
					labels.push(t('settings.appearance.option', { context: option.label }));
					return [values, labels];
				},
				[[], []]
			),
		[t]
	);

	const savedOptionIndex = useMemo<number>(() => {
		const savedScalingValueSetting = scalingSettings['settings.appearance_setting.scaling'];
		if (savedScalingValueSetting !== undefined) {
			const optionIndex = scalingOptionValues.findIndex(
				(option) => option === savedScalingValueSetting
			);
			if (optionIndex >= 0) {
				return optionIndex;
			}
		}
		return AUTOSCALING_FONT_OPTION_INDEX;
	}, [scalingOptionValues, scalingSettings]);

	const [autoScaling, setAutoScaling] = useState(
		scalingSettings['settings.appearance_setting.auto'] ?? true
	);
	const [scalingValue, setScalingValue] = useState<number>(savedOptionIndex);

	useEffect(() => {
		// update input value when setting is updated
		setScalingValue(savedOptionIndex);
	}, [savedOptionIndex]);

	useEffect(() => {
		if (scalingOptionValues[scalingValue]) {
			if (scalingValue !== savedOptionIndex) {
				addLocalStoreChange(
					'settings.appearance_setting.scaling',
					scalingOptionValues[scalingValue]
				);
			} else {
				cleanLocalStoreChange('settings.appearance_setting.scaling');
			}
		}
	}, [
		addLocalStoreChange,
		cleanLocalStoreChange,
		savedOptionIndex,
		scalingOptionValues,
		scalingSettings,
		scalingValue
	]);

	useEffect(() => {
		if (
			(scalingSettings['settings.appearance_setting.auto'] !== undefined &&
				autoScaling !== scalingSettings['settings.appearance_setting.auto']) ||
			(scalingSettings['settings.appearance_setting.auto'] === undefined && !autoScaling)
		) {
			addLocalStoreChange('settings.appearance_setting.auto', autoScaling);
			if (autoScaling) {
				addLocalStoreChange('settings.appearance_setting.scaling', undefined);
			}
		} else {
			cleanLocalStoreChange('settings.appearance_setting.auto');
		}
	}, [addLocalStoreChange, autoScaling, cleanLocalStoreChange, scalingSettings]);

	const increaseScalingByStep = useCallback(() => {
		setScalingValue((prevState) =>
			prevState < SCALING_OPTIONS.length - 1 ? prevState + 1 : prevState
		);
	}, []);

	const decreaseScalingByStep = useCallback(() => {
		setScalingValue((prevState) => (prevState > 0 ? prevState - 1 : prevState));
	}, []);

	const toggleAutoScaling = useCallback(() => {
		setAutoScaling((prevState) => !prevState);
		setScalingValue(savedOptionIndex);
	}, [savedOptionIndex]);

	const onChangeScalingValue = useCallback<NonNullable<SliderProps['onChange']>>(
		(ev, newValueIndex) => {
			setScalingValue(newValueIndex);
		},
		[]
	);

	const resetHandler = useCallback((): void => {
		setScalingValue(savedOptionIndex);
		setAutoScaling(scalingSettings['settings.appearance_setting.auto'] ?? true);
	}, [savedOptionIndex, scalingSettings]);

	useReset(resetRef, resetHandler);

	const exampleText = useMemo(
		() =>
			t(
				'settings.appearance.labels.choose_size_pangram',
				'The quick brown fox jumps over the lazy dog.'
			),
		[t]
	);

	const exampleFontSize = useMemo<number>(
		() =>
			// Revert the percentage and then apply the new value to use the browser base font-size and not the html font-size rule
			// Explanation:
			// - reverting factor (factor to apply to current font to obtain the browser font size) = unsaved input value / local storage value
			// - new font size percentage = reverting factor * 100
			// The resulting value is the percentage to apply to current html font-size to obtain the same calculated value
			// as if the scalingValue was set in the html.
			// E.g.: html: 75%, scalingValue: 100 -> 1 rem is 12px (because of the 75%). In the browser the base font is set to 16px.
			// To make scalingValue 100 equals to 16px, we need to get the reverting factor (100 / 75 = 1.3333).
			// This is the factor required to have 16 starting from 12 (12*1.3333 ~= 16)
			// The percentage to apply to the example container is then 1.3333 * 100 = 133.33 (133.33%(75) ~= 100 ~= 16px)
			((scalingOptionValues[Math.round(scalingValue)] || 100) /
				scalingOptionValues[savedOptionIndex]) *
			100,
		[savedOptionIndex, scalingOptionValues, scalingValue]
	);

	return (
		<Container
			orientation={'vertical'}
			mainAlignment={'flex-start'}
			crossAlignment={'flex-start'}
			gap={'1rem'}
			height={'fit'}
			width={'fill'}
		>
			<Container
				orientation={'vertical'}
				gap={'1rem'}
				height={'fit'}
				width={'fit'}
				mainAlignment={'flex-start'}
				crossAlignment={'flex-start'}
				maxWidth={'100%'}
			>
				<Text size="small" overflow={'break-word'}>
					{t(
						'settings.appearance.labels.choose_size_description',
						'Choose Type Size and Styles for Carbonio Environment'
					)}
				</Text>
				<ScalingSliderContainer
					orientation="horizontal"
					width="fill"
					height="auto"
					padding={{ vertical: 'small', horizontal: 'large' }}
					gap={'0.5rem'}
					flexGrow={1}
				>
					<Tooltip
						label={t('settings.appearance.labels.decrease', 'Decrease', {
							context: scalingValue === 0 ? 'disabled' : ''
						})}
					>
						<Container width="fit" height="fit" minWidth={'fit-content'}>
							<Button
								disabled={autoScaling || scalingValue === 0}
								label={t('settings.appearance.labels.a', 'A')}
								type={'ghost'}
								size={'extrasmall'}
								color={'text'}
								onClick={decreaseScalingByStep}
								minWidth={'fit-content'}
							/>
						</Container>
					</Tooltip>
					<Slider
						disabled={autoScaling}
						options={scalingOptionLabels}
						onChange={onChangeScalingValue}
						value={
							autoScaling && BASE_FONT_OPTION_INDEX >= 0 ? BASE_FONT_OPTION_INDEX : scalingValue
						}
					/>
					<Tooltip
						label={t('settings.appearance.labels.increase', 'Increase', {
							context: scalingValue === SCALING_OPTIONS.length - 1 ? 'disabled' : ''
						})}
					>
						<Container width="fit" height="fit" minWidth={'fit-content'}>
							<Button
								disabled={autoScaling || scalingValue === SCALING_OPTIONS.length - 1}
								label={t('settings.appearance.labels.a', 'A')}
								type={'ghost'}
								size={'extralarge'}
								onClick={increaseScalingByStep}
								color={'text'}
								minWidth={'fit-content'}
							/>
						</Container>
					</Tooltip>
				</ScalingSliderContainer>
				<Checkbox
					value={autoScaling}
					onClick={toggleAutoScaling}
					label={t(
						'settings.appearance.labels.choose_size_auto',
						'Automatically resize the text size depending on the device'
					)}
					size={'small'}
				/>
			</Container>
			<ExampleContainer
				background={'gray5'}
				padding={'large'}
				gap={'0.5rem'}
				orientation={'vertical'}
				mainAlignment={'flex-start'}
				crossAlignment={'flex-start'}
				width={'fill'}
				$fontSize={exampleFontSize}
			>
				<ExampleText weight={'light'} overflow={'break-word'}>
					{exampleText}
				</ExampleText>
				<ExampleText weight={'regular'} overflow={'break-word'}>
					{exampleText}
				</ExampleText>
				<ExampleText weight={'bold'} overflow={'break-word'}>
					{exampleText}
				</ExampleText>
			</ExampleContainer>
		</Container>
	);
};
