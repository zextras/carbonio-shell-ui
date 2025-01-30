/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useMemo } from 'react';

import {
	Breadcrumbs,
	Button,
	Container,
	type Crumb,
	Divider,
	Padding,
	Row
} from '@zextras/carbonio-design-system';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { getT } from '../../store/i18n/hooks';

const CustomBreadcrumbs = styled(Breadcrumbs)`
	.breadcrumbCrumb {
		cursor: default;
	}
`;

export type SettingsHeaderProps = {
	title: string;
	onSave: () => void;
	onCancel: () => void;
	isDirty: boolean;
};

export const SettingsHeader = ({
	onSave,
	onCancel,
	isDirty,
	title
}: SettingsHeaderProps): React.JSX.Element => {
	const t = getT();
	const { search } = useLocation();
	const params = useParams();
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

	useEffect(() => {
		if (search) {
			// TODO: why not using anchor links instead of js?
			setTimeout(
				() => document.querySelector(`#${search}`.replace('?section=', ''))?.scrollIntoView(),
				1
			);
		}
	}, [search, params]);
	return (
		<>
			<Container
				orientation="vertical"
				mainAlignment="space-around"
				background={'gray5'}
				height="fit"
			>
				<Row orientation="horizontal" width="100%">
					<Row
						padding={{ all: 'small' }}
						mainAlignment="flex-start"
						width="50%"
						crossAlignment="flex-start"
					>
						<CustomBreadcrumbs crumbs={crumbs} />
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
