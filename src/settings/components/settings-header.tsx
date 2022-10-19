/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect } from 'react';
import {
	Padding,
	Row,
	Text,
	Container,
	ButtonOld as Button,
	Divider,
	Breadcrumbs
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { SETTINGS_APP_ID } from '../../constants';
import { RouteLeavingGuard } from '../../ui-extras/nav-guard';

type SettingsHeaderProps = {
	title: string;
	onSave: () => void;
	onCancel: () => void;
	isDirty: boolean;
};

const SettingsHeader: FC<SettingsHeaderProps> = ({ onSave, onCancel, isDirty, title }) => {
	const [t] = useTranslation();
	const history = useHistory();
	const useparam = useParams();
	const crumbs = [
		{
			id: 'settings',
			label: t('settings.app', 'Settings'),
			click: (): void => history.push(`/${SETTINGS_APP_ID}/`)
		},
		{
			id: 'general',
			label: title,
			click: (): void => history.push(`/${SETTINGS_APP_ID}/`)
		}
	];
	const search = history.location?.search;
	useEffect(() => {
		if (search) {
			setTimeout(
				() =>
					document
						.querySelector(`#${history.location.search}`.replace('?section=', ''))
						?.scrollIntoView(),
				1
			);
		}
	}, [history, history.location, history.location.search, search, useparam]);
	return (
		<>
			<RouteLeavingGuard when={isDirty} onSave={onSave}>
				<Text>
					{t(
						'label.unsaved_changes_line1',
						'Are you sure you want to leave this page without saving?'
					)}
				</Text>
				<Text>{t('label.unsaved_changes_line2', 'All your unsaved changes will be lost')}</Text>
			</RouteLeavingGuard>
			<Container
				orientation="vertical"
				mainAlignment="space-around"
				background="gray5"
				height="fit"
			>
				<Row orientation="horizontal" width="100%">
					<Row
						padding={{ all: 'small' }}
						mainAlignment="flex-start"
						width="50%"
						crossAlignment="flex-start"
					>
						<Breadcrumbs crumbs={crumbs} />
					</Row>
					<Row
						padding={{ all: 'small' }}
						width="50%"
						mainAlignment="flex-end"
						crossAlignment="flex-end"
					>
						<Padding right="small">
							<Button
								label={t('label.discard_changes', 'DISCARD CHANGES')}
								onClick={onCancel}
								color="secondary"
								disabled={!isDirty}
							/>
						</Padding>
						<Button
							label={t('label.save', 'Save')}
							color="primary"
							onClick={onSave}
							disabled={!isDirty}
						/>
					</Row>
				</Row>
			</Container>
			<Divider />
		</>
	);
};

export default SettingsHeader;
