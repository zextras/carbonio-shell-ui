import React from 'react';
import { I18nextProvider } from 'react-i18next';
import BoardContextProvider from '../shell/boards/board-context-provider';
import { BootstrapperContext } from './bootstrapper-context';

export default function BootstrapperContextProvider({ children, i18nFactory, storeFactory }) {
	return (
		<BootstrapperContext.Provider
			value={{
				storeFactory,
				i18nFactory
			}}
		>
			<I18nextProvider i18n={i18nFactory.getShellI18n()}>
				<BoardContextProvider>{children}</BoardContextProvider>
			</I18nextProvider>
		</BootstrapperContext.Provider>
	);
}
