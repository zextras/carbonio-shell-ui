/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FormSection } from '@zextras/carbonio-design-system';

import type { SettingsSubSection } from '../../../types/apps';

type SettingsSectionProps = React.PropsWithChildren<SettingsSubSection>;

export const SettingsSection = ({
	children,
	label,
	id
}: SettingsSectionProps): React.JSX.Element => (
	<FormSection label={label} id={id} data-testid={id}>
		{children}
	</FormSection>
);
