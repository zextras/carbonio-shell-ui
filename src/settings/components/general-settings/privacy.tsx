/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';

import { Checkbox, Container, Padding, Text } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import type { AddMod, RemoveMod } from '../../../types/network';
import type { SettingsSectionProps } from '../utils';
import { upsertPrefOnUnsavedChanges } from '../utils';

interface PrivacyProps extends SettingsSectionProps {
	addMod: AddMod;
	removeMod: RemoveMod;
	sendAnalyticsPref: boolean;
}

export const Privacy = ({
	addMod,
	removeMod,
	resetRef,
	sendAnalyticsPref
}: PrivacyProps): React.JSX.Element => {
	const [t] = useTranslation();
	const [checkboxValue, setCheckboxValue] = useState(sendAnalyticsPref);
	const checkboxValueRef = useRef(sendAnalyticsPref);

	const reset = useCallback(() => {
		setCheckboxValue(sendAnalyticsPref);
		checkboxValueRef.current = sendAnalyticsPref;
	}, [sendAnalyticsPref]);

	useImperativeHandle(
		resetRef,
		() => ({
			reset
		}),
		[reset]
	);

	const updatePref = useMemo(() => upsertPrefOnUnsavedChanges(addMod), [addMod]);

	const toggleCheckboxValue = useCallback(() => {
		const newValue = !checkboxValueRef.current;
		checkboxValueRef.current = newValue;
		setCheckboxValue(newValue);
		if (newValue !== sendAnalyticsPref) {
			updatePref('carbonioPrefSendAnalytics', newValue);
		} else {
			removeMod('prefs', 'carbonioPrefSendAnalytics');
		}
	}, [removeMod, sendAnalyticsPref, updatePref]);

	return (
		<Container
			gap={'0.25rem'}
			mainAlignment={'flex-start'}
			crossAlignment={'flex-start'}
			height={'fit'}
		>
			<Checkbox
				value={checkboxValue}
				label={t('settings.privacy.allowAnalytics.label', 'Allow data analytics')}
				onClick={toggleCheckboxValue}
				size={'small'}
			/>
			<Padding left={'1.5rem'}>
				<Text overflow={'break-word'} size={'small'} lineHeight={1.5} color={'gray1'}>
					{t(
						'settings.privacy.allowAnalytics.description',
						'Your data is safe. All information we gather is and will stay anonymous. It will be used by our team to understand how can we improve Carbonio.'
					)}
				</Text>
			</Padding>
		</Container>
	);
};
