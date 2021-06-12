import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FormSubSection, Container, Text, Badge, Divider, Tooltip } from '@zextras/zapp-ui';
import { AccountSettings } from '../../types';
import { useUserAccounts } from '../shell/hooks';

const ModuleVersionSettings: FC<{
	settings: AccountSettings;
	addMod: (type: string, key: string, value: { value: any; app: string }) => void;
}> = ({ settings, addMod }) => {
	const [t] = useTranslation();
	const accounts = useUserAccounts();

	return (
		<>
			<FormSubSection
				label={t('module.app.version', 'Application versions')}
				minWidth="calc(min(100%, 512px))"
				width="50%"
			>
				{accounts[0].apps.map((item: any) => (
					<Container key={item.entryPoint} padding={{ horizontal: 'large', vertical: 'small' }}>
						<Container orientation="horizontal" mainAlignment="space-between">
							<Text>{item.name}</Text>
							<Tooltip placement="top" label="Click to copy">
								<Text style={{ cursor: 'pointer' }}>Version: {item.version}</Text>
							</Tooltip>
						</Container>
						<Container
							orientation="horizontal"
							mainAlignment="space-between"
							padding={{ top: 'extrasmall', bottom: 'medium' }}
						>
							<Text color="secondary">{item.description}</Text>
							<Badge value="Active" style={{ backgroundColor: '#8bc34a', color: 'white' }}></Badge>
						</Container>
						<Divider color="gray2" />
					</Container>
				))}
			</FormSubSection>
		</>
	);
};

export default ModuleVersionSettings;
