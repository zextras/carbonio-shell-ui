/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { SelectItem, SingleSelectionOnChange } from '@zextras/carbonio-design-system';
import { Select, Text } from '@zextras/carbonio-design-system';
import { find } from 'lodash';

import { DARK_READER_PROP_KEY, SHELL_APP_ID } from '../../../constants';
import {
	isDarkReaderPropValues,
	useDarkReaderResultValue
} from '../../../dark-mode/use-dark-reader-result-value';
import type { DarkReaderPropValues } from '../../../dark-mode/utils';
import { getT } from '../../../store/i18n';
import type { AddMod, RemoveMod } from '../../../types/network';
import { useReset } from '../../hooks/use-reset';
import type { SettingsSectionProps } from '../utils';

type DarkReaderSelectItem = Array<SelectItem & { value: DarkReaderPropValues }>;

interface DarkThemeSettingSectionProps extends SettingsSectionProps {
	addMod: AddMod;
	removeMod: RemoveMod;
}

const DarkThemeSettingSection = ({
	addMod,
	removeMod,
	resetRef
}: DarkThemeSettingSectionProps): React.JSX.Element | null => {
	const darkReaderResultValue = useDarkReaderResultValue();
	const [selection, setSelection] = useState<SelectItem>();

	const t = getT();
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
					addMod('props', DARK_READER_PROP_KEY, { app: SHELL_APP_ID, value });
				} else {
					removeMod('props', DARK_READER_PROP_KEY);
				}
			}
		},
		[addMod, darkReaderResultValue, removeMod, setSelectNewValue]
	);

	useEffect(() => {
		if (darkReaderResultValue) {
			setSelectNewValue(darkReaderResultValue);
		}
	}, [darkReaderResultValue, items, setSelectNewValue]);

	const init = useCallback(() => {
		if (darkReaderResultValue) {
			setSelectNewValue(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setSelectNewValue]);

	useReset(resetRef, init);

	if (!selection) {
		return null;
	}
	return (
		<>
			<Text size="medium" weight="bold">
				{t('settings.general.theme_options', 'Theme Options')}
			</Text>
			<Select
				items={items}
				selection={selection}
				label={t('settings.general.dark_mode', 'Dark Mode')}
				onChange={onSelectionChange}
			/>
		</>
	);
};

export default DarkThemeSettingSection;
