/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useCallback, useEffect, useState } from 'react';
import { forEach } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Modal, Text, Container, Divider } from '@zextras/zapp-ui';
import styled from 'styled-components';
import moment from 'moment';
import MarkdownContainer from './markdown-container';
import { useApps } from '../app-store/hooks';

const Title = styled(Text)`
	width: 100%;
	font-family: ${({ theme }) => theme.fonts.default};
	font-size: 15px;
	background: ${({ theme }) => theme.palette.gray5.regular};
`;

const CHANGELOG_VERSION_REGEX = /([0-9]\.[0-9]\.[0-9][0-9]-beta\.[0-9])/;

export default function ChangeLogModal() {
	const [mdpackage, setMdPackage] = useState({});
	const [showUpdate, setShowUpdate] = useState(false);
	const { t } = useTranslation();
	const apps = useApps();

	useEffect(() => {
		const updateLog = {};
		let count = 0;
		forEach(apps, async (value, key) => {
			count += 1;
			fetch(`${apps[key].core.resourceUrl}/CHANGELOG.md`)
				.then((res) => res.text())
				.then((content) => {
					const changelogVersion = content.match(CHANGELOG_VERSION_REGEX)[0];
					if (value.core.version.localeCompare(changelogVersion) !== 0) {
						const requiredContent = content.substr(191, content.length);
						updateLog[apps[key].crossAlignment.name] = requiredContent;
						if (count === Object.keys(apps).length) setMdPackage(updateLog);
						setTimeout(() => setShowUpdate(true), 15000);
					}
				})
				.catch(() => null);
		});
	}, [apps]);

	const remindLater = useCallback(() => {
		setShowUpdate(false);
		const today = moment();
		const nextNotifyOn = today.add(15, 'days').valueOf();
		localStorage.setItem('nextNotifyOn', nextNotifyOn);
	}, [setShowUpdate]);

	const onClose = useCallback(() => {
		setShowUpdate(false);
	}, [setShowUpdate]);

	return (
		<div>
			<Modal
				title={t('changelog.title')}
				open={showUpdate}
				onConfirm={remindLater}
				onClose={onClose}
				dismissLabel={t('changelog.cancel')}
				confirmLabel={t('changelog.close')}
				onSecondaryAction={onClose}
				secondaryActionLabel={t('changelog.remind_later')}
			>
				<Container>
					{Object.keys(mdpackage).map((key) => (
						<Container
							orientation="vertical"
							mainAlignment="baseline"
							key={key}
							crossAlignment="baseline"
						>
							<Title weight="bold">{key}</Title>
							<MarkdownContainer content={mdpackage[key]} />
							<Divider color="secondary" />
						</Container>
					))}
				</Container>
			</Modal>
		</div>
	);
}
