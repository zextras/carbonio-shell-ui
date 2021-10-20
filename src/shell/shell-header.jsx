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
import React, { useMemo } from 'react';
import { reduce, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
	Container,
	Dropdown,
	IconButton,
	Logo,
	Padding,
	Responsive,
	useScreenMode,
	MultiButton
} from '@zextras/zapp-ui';
import { useAppStore } from '../app-store';
import { SearchBar } from '../search/search-bar';
import styled from 'styled-components';

const MultiButtonEl = styled(MultiButton)``;

export default function ShellHeader({ mobileNavIsOpen, onMobileMenuClick, children }) {
	const history = useHistory();
	const [t] = useTranslation();
	const screenMode = useScreenMode();
	const currentApp = useMemo(() => history.location.pathname.split('/')[1], [
		history.location.pathname
	]);

	const [primaryAction, secondaryActions] = useAppStore((s) => [
		s.apps[currentApp]?.newButton?.primary,
		reduce(
			s.apps,
			(acc, app, key) => {
				if (app.newButton?.secondaryItems) {
					if (acc.length > 0) {
						acc.push({ type: 'divider', id: key, key, label: 'really?' });
					}
					if (app.newButton?.primary) {
						acc.push(app.newButton?.primary);
					}
					acc.push(
						...map(app.newButton?.secondaryItems, (item) => ({
							...item,
							key: item.id,
							disabled: item.disabled || item.getDisabledStatus?.()
						}))
					);
				}
				return acc;
			},
			[]
		)
	]);

	const isMultiButtonDisabled = useMemo(
		() => !!primaryAction || primaryAction?.disabled || primaryAction?.getDisabledState?.(),
		[primaryAction]
	);

	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="60px"
			minHeight="60px"
			maxHeight="60px"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Container orientation="horizontal" width="75%" maxWidth="75%" mainAlignment="space-between">
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Logo size="large" style={{ minWidth: 'max-content' }} />
				<Padding horizontal="large">
					<MultiButtonEl
						style={{ height: '44px' }}
						background="primary"
						label={t('new', 'New')}
						onClick={primaryAction?.click}
						items={secondaryActions}
						disabled={isMultiButtonDisabled}
						// buttonFontSize="small"
						// buttonContainerPadding={{ all: 'none' }}
						// buttonLabelPadding={{ all: 'large' }}
						// iconPadding={{ right: 'small' }}
						// padding={{ all: 'large' }}
					/>
				</Padding>
				<Responsive mode="desktop">
					<SearchBar
						currentApp={currentApp}
						primaryAction={primaryAction}
						secondaryActions={secondaryActions}
					/>
				</Responsive>
			</Container>
			<Container orientation="horizontal" width="25%" mainAlignment="flex-end">
				<Responsive mode="desktop">{children}</Responsive>
				<Responsive mode="mobile">
					<Container
						orientation="horizontal"
						mainAlignment="flex-end"
						padding={{ right: 'extrasmall' }}
					>
						<Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown>
					</Container>
				</Responsive>
			</Container>
		</Container>
	);
}
