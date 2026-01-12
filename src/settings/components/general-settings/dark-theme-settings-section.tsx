/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { SelectItem, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { FormSubSection } from '@zextras/carbonio-design-system';
import { find } from 'lodash';
import { useTranslation } from 'react-i18next';

import {
	isDarkReaderPropValues,
	useDarkReaderResultValue
} from '../../../dark-mode/use-dark-reader-result-value';
import type { DarkReaderPropValues } from '../../../dark-mode/utils';
import type { AddMod, RemoveMod } from '../../../types/network';
import { useReset } from '../../hooks/use-reset';
import { SelectWithError } from '../select-with-error';
import type { SettingsSectionProps } from '../utils';

type DarkReaderSelectItem = Array<SelectItem & { value: DarkReaderPropValues }>;

interface DarkThemeSettingSectionProps extends SettingsSectionProps {
	addMod: AddMod;
	removeMod: RemoveMod;
	invalidOption: SelectItem;
}

const DarkThemeSettingSection = ({
	addMod,
	removeMod,
	invalidOption,
	resetRef
}: DarkThemeSettingSectionProps): React.JSX.Element | null => {
	const [t] = useTranslation();
	const darkReaderResultValue = useDarkReaderResultValue();
	const [selection, setSelection] = useState<SelectItem>({
		label: t('settings.general.theme_auto', 'Auto'),
		value: 'auto'
	});

	const items = useMemo(
		(): DarkReaderSelectItem => [
			{
				label: t('settings.general.theme_auto', 'Auto'),
				value: 'auto'
			},
			{
				label: t('settings.general.theme_enabled', 'Enabled'),
				value: 'enabled'
			},
			{
				label: t('settings.general.theme_disabled', 'Disabled'),
				value: 'disabled'
			}
		],
		[t]
	);

	const setSelectNewValue = useCallback(
		(value: DarkReaderPropValues) => {
			const item = find(items, { value });
			if (item) {
				setSelection(item);
			}
		},
		[items]
	);

	const onSelectionChange = useCallback<SingleSelectionOnChange>(
		(value) => {
			if (isDarkReaderPropValues(value)) {
				if (value) {
					setSelectNewValue(value);
				}
				if (value !== darkReaderResultValue) {
					addMod('prefs', 'carbonioPrefDarkMode', value);
				} else {
					removeMod('prefs', 'carbonioPrefDarkMode');
				}
			}
		},
		[addMod, darkReaderResultValue, removeMod, setSelectNewValue]
	);

	useEffect(() => {
		if (darkReaderResultValue) {
			setSelectNewValue(darkReaderResultValue);
		} else {
			setSelection(invalidOption);
		}
	}, [darkReaderResultValue, invalidOption, items, setSelectNewValue]);

	const init = useCallback(() => {
		if (darkReaderResultValue) {
			setSelectNewValue(darkReaderResultValue);
		} else {
			setSelection(invalidOption);
		}
	}, [darkReaderResultValue, invalidOption, setSelectNewValue]);

	useReset(resetRef, init);

	const isInvalidOption = useMemo(() => selection === invalidOption, [invalidOption, selection]);

	return (
		<FormSubSection label={t('settings.general.theme_options', 'Theme Options')}>
			<SelectWithError
				data-testid={'select-dark-theme'}
				items={items}
				selectLabel={t('settings.general.dark_mode', 'Dark Mode')}
				selection={selection}
				onChange={onSelectionChange}
				hasError={isInvalidOption}
				errorMessage={t(
					'settings.general.dark_mode_error',
					'The current value is not recognized. The interface has defaulted to System theme. Please select a valid option to change the theme.'
				)}
			/>
		</FormSubSection>
	);
};

export default DarkThemeSettingSection;
