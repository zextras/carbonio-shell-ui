/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { ReactElement } from 'react';
import React, { useState, useCallback, useEffect, useMemo } from 'react';

import type { InputProps } from '@zextras/carbonio-design-system';
import { Container, Text, Padding, Input, Row } from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';

import type { IdentityAttrs } from '../../../types/account';

interface PersonaSettingsProps {
	identityAttrs: IdentityAttrs;
	updateIdentities: <K extends keyof IdentityAttrs>(
		id: string,
		key: K,
		value: IdentityAttrs[K]
	) => void;
}

const PersonaSettings = ({
	identityAttrs,
	updateIdentities
}: PersonaSettingsProps): ReactElement => {
	const [t] = useTranslation();
	const [personaValue, setPersonaValue] = useState(identityAttrs.zimbraPrefIdentityName);
	const personaLabel = useMemo(() => t('label.persona_name', 'Persona Name'), [t]);
	useEffect(() => {
		setPersonaValue(identityAttrs.zimbraPrefIdentityName);
	}, [identityAttrs.zimbraPrefIdentityName]);

	const onChange = useCallback<NonNullable<InputProps['onChange']>>(
		(ev) => {
			setPersonaValue(ev.target.value);
			if (identityAttrs.zimbraPrefIdentityId) {
				updateIdentities(
					identityAttrs.zimbraPrefIdentityId,
					'zimbraPrefIdentityName',
					ev.target.value
				);
			}
		},
		[identityAttrs.zimbraPrefIdentityId, updateIdentities]
	);

	return (
		<>
			<Container
				minWidth="calc(min(100%, 32rem))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Padding horizontal="medium" width="100%">
					<Text weight="bold">{t('label.persona_settings', 'Persona Settings')}</Text>
				</Padding>
			</Container>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Row orientation="vertical" mainAlignment="flex-start" width="fill">
					<Row orientation="horizontal" width="100%" mainAlignment="flex-start">
						<Text color="secondary">
							{t(
								'label.use_personas_line1',
								'Use personas to quickly change many settings when sending e-mail messages.'
							)}
						</Text>
					</Row>
					<Row orientation="horizontal" width="100%" mainAlignment="flex-start">
						<Text color="secondary">
							{t(
								'label.use_personas_line2',
								'For example, if you sometimes send e-mails in a particular role at work, create a persona for that.'
							)}
						</Text>
					</Row>
				</Row>
			</Row>
			<Row
				width="fill"
				padding={{ horizontal: 'large', bottom: 'large' }}
				height="fit"
				background={'gray6'}
				mainAlignment="flex-start"
			>
				<Row takeAvailableSpace>
					<Input label={personaLabel} value={personaValue} onChange={onChange} />
				</Row>
			</Row>

			<Padding bottom="large" />
		</>
	);
};

export default PersonaSettings;
