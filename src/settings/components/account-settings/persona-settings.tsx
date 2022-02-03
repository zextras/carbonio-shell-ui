/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useState, useCallback, ReactElement, useEffect } from 'react';
import { Container, Text, Padding, Input, Row } from '@zextras/carbonio-design-system';
import { TFunction } from 'i18next';
import { IdentityProps } from '../../../../types';

interface PersonaSettingsProps {
	t: TFunction;
	items: IdentityProps;
	updateIdentities: (id: string, key: string, pref: string) => void;
	setMods: (mods: { [key: string]: unknown }) => void;
}

const PersonaSettings = ({
	t,
	items,
	updateIdentities,
	setMods
}: PersonaSettingsProps): ReactElement => {
	const [personaLabel, setPersonaLabel] = useState(items.identityName);
	useEffect(() => {
		setPersonaLabel(items.identityName);
	}, [items.identityName]);

	const onChange = useCallback(
		(ev) => {
			setPersonaLabel(ev.target.value);
			if (ev.target.value === items?.identityName) {
				setMods({});
			} else {
				updateIdentities(items.identityId, 'zimbraPrefIdentityName', ev.target.value);
			}
		},
		[items?.identityName, updateIdentities, setMods, items.identityId, setPersonaLabel]
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
						<Text background="gray6" color="secondary" width="fill">
							{t(
								'label.use_personas_line1',
								'Use personas to quickly change many settings when sending e-mail messages.'
							)}
						</Text>
					</Row>
					<Row orientation="horizontal" width="100%" mainAlignment="flex-start">
						<Text background="gray6" color="secondary">
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
					<Input
						label={t('label.persona_name', 'Persona Name')}
						value={personaLabel}
						background="gray5"
						onChange={onChange}
					/>
				</Row>
			</Row>

			<Padding bottom="large" />
		</>
	);
};

export default PersonaSettings;
