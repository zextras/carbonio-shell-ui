/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useCallback, ReactElement, useEffect, useMemo } from 'react';
import { Container, Text, Padding, Input, Row } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { IdentityProps } from '../../../../types';

interface PersonaSettingsProps {
	t: TFunction;
	items: IdentityProps;
	updateIdentities: (modifyList: {
		id: string | number;
		key: string;
		value: string | boolean;
	}) => void;
}

const PersonaSettings = ({ t, items, updateIdentities }: PersonaSettingsProps): ReactElement => {
	const [personaValue, setPersonaValue] = useState(items.identityName);
	const personaLabel = useMemo(
		() => (personaValue ? '' : t('label.persona_name', 'Persona Name')),
		[personaValue, t]
	);
	useEffect(() => {
		setPersonaValue(items.identityName);
	}, [items.identityName]);

	const onChange = useCallback(
		(ev) => {
			setPersonaValue(ev.target.value);
			const modifyProp = {
				id: items.identityId,
				key: 'zimbraPrefIdentityName',
				value: ev.target.value
			};

			updateIdentities(modifyProp);
		},
		[updateIdentities, items.identityId, setPersonaValue]
	);

	return (
		<>
			<Container
				minWidth="calc(min(100%, 512px))"
				width="fill"
				padding={{ all: 'large' }}
				height="fit"
				background="gray6"
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
				background="gray6"
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
				background="gray6"
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
