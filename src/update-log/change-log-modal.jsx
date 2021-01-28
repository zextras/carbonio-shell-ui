/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { useEffect, useState } from "react";
import { forEach } from "lodash";
import { Modal, Text, Button, Container, Divider } from "@zextras/zapp-ui";
import styled from "styled-components";
import moment from "moment";
import MarkdownContainer from './markdown-container'


const Title = styled(Text)`
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.default};
  font-size: 15px;
  background: ${({ theme }) => theme.palette.gray5.regular};
`;

const CHANGELOG_VERSION_REGEX = /([0-9]\.[0-9]\.[0-9][0-9]-beta\.[0-9])/;

export default function ChangeLogModal({ cache }) {
	const [mdpackage, setMdPackage] = useState({});
	const [showUpdate, setShowUpdate] = useState(false);
	const [nextDate, setNextDate] = useState(new Date());

	const executeReading = async (data) => {
		const updateLog = {};
		let count = 0;
		forEach(data, async (value, key) => {
			count += 1;
			fetch(`${data[key].pkg.resourceUrl}/CHANGELOG.md`)
				.then((res) => res.text())
				.then((content) => {
					const changelogVersion = content.match(
						CHANGELOG_VERSION_REGEX
					)[0];
					if (value.pkg.version.localeCompare(changelogVersion) !== 0) {
						const requiredContent = content.substr(191, content.length);
						updateLog[data[key].pkg.name] = requiredContent;
						if (count === Object.keys(data).length) setMdPackage(updateLog);
						setTimeout(() => setShowUpdate(true), 15000);
					}
				})
				.catch((err) => null);
		});
	};

	useEffect(() => {
		executeReading(cache);
	}, [cache]);

	const remindLater = () => {
		setShowUpdate(false);
		const today = moment();
		const nextNotifyOn = today.add(15, "days").valueOf();
		localStorage.setItem("nextNotifyOn", nextNotifyOn);
	};

	return (
		<div>
			<Modal
				title='Change Log'
				open={showUpdate}
				onConfirm={remindLater}
				onClose={() => setShowUpdate(false)}
				dismissLabel='Cancel'
				confirmLabel='Close'
				onSecondaryAction={() => setShowUpdate(false) }
				secondaryActionLabel='Remind Later'>
				<Container>
					{Object.keys(mdpackage).map((key) => {
						return (
							<Container
								orientation='vertical'
								mainAlignment='baseline'
								key={key}
								crossAlignment='baseline'>
								<Title weight='bold'>{key}</Title>
								<MarkdownContainer content={mdpackage[key]} />
								<Divider color='secondary' />
							</Container>
						);
					})}
				</Container>
			</Modal>
		</div>
	);
}
