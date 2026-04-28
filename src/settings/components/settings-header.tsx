/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useMemo } from 'react';

import styled from '@emotion/styled';
import {
	Breadcrumbs,
	Button,
	Container,
	type Crumb,
	Divider,
	Padding,
	Row,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import type { RouteLeavingGuardProps } from '../../ui-extras/nav-guard';
import { RouteLeavingGuard } from '../../ui-extras/nav-guard';

const CustomBreadcrumbs = styled(Breadcrumbs)`
	.breadcrumbCrumb {
		cursor: default;
	}
`;

type BaseSettingsHeaderProps = {
	title: string;
};

type SettingsHeaderPropsWithSaving = BaseSettingsHeaderProps & {
	hideSavingOptions?: false;
	onSave: RouteLeavingGuardProps['onSave'];
	onCancel: () => void;
	isDirty: boolean;
	hasError?: boolean;
};

type SettingsHeaderPropsWithoutSaving = BaseSettingsHeaderProps & {
	hideSavingOptions: true;
	onSave?: never;
	onCancel?: never;
	isDirty?: never;
	hasError?: never;
};

export type SettingsHeaderProps = SettingsHeaderPropsWithSaving | SettingsHeaderPropsWithoutSaving;

export const SettingsHeader = ({
	onSave,
	onCancel,
	isDirty,
	title,
	hasError = false,
	hideSavingOptions = false
}: SettingsHeaderProps): React.JSX.Element => {
	const [t] = useTranslation();
	const [searchParams] = useSearchParams();
	const section = useMemo(() => searchParams.get('section'), [searchParams]);

	const crumbs = useMemo(
		(): Crumb[] => [
			{
				id: 'settings',
				label: t('settings.app', 'Settings'),
				className: 'breadcrumbCrumb'
			},
			{
				id: 'general',
				label: title,
				className: 'breadcrumbCrumb'
			}
		],
		[t, title]
	);
	const isSaveDisabled = useMemo(() => !isDirty || hasError, [hasError, isDirty]);

	useEffect(() => {
		if (section) {
			setTimeout(() => document.getElementById(section)?.scrollIntoView(), 1);
		}
	}, [section]);
	return (
		<>
			{!hideSavingOptions && onSave && (
				<RouteLeavingGuard when={isDirty} onSave={onSave}>
					<Text>
						{t(
							'label.unsaved_changes_line1',
							'Are you sure you want to leave this page without saving?'
						)}
					</Text>
					<Text>{t('label.unsaved_changes_line2', 'All your unsaved changes will be lost')}</Text>
				</RouteLeavingGuard>
			)}
			<Container
				orientation="vertical"
				mainAlignment="space-around"
				background={'gray5'}
				height="fit"
				data-testid="settings-header"
			>
				<Row orientation="horizontal" width="100%" minHeight={'3.2rem'}>
					<Row
						padding={{ all: 'small' }}
						mainAlignment="flex-start"
						flexGrow={1}
						crossAlignment="flex-start"
					>
						<CustomBreadcrumbs crumbs={crumbs} />
					</Row>
					{!hideSavingOptions && (
						<Row
							padding={{ all: 'small' }}
							flexGrow={1}
							mainAlignment="flex-end"
							crossAlignment="flex-end"
						>
							<Padding right="small">
								<Button
									label={t('label.discard_changes', 'DISCARD CHANGES')}
									onClick={onCancel!}
									color="secondary"
									disabled={!isDirty}
								/>
							</Padding>
							<Button
								label={t('label.save', 'Save')}
								color="primary"
								onClick={onSave!}
								disabled={isSaveDisabled}
							/>
						</Row>
					)}
				</Row>
			</Container>
			<Divider />
		</>
	);
};
