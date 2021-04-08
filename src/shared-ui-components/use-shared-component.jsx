import React, { useContext, useMemo } from 'react';
import { get } from 'lodash';
import AppContextProvider from '../app/app-context-provider';
import { SharedUIComponentsContext } from './shared-ui-components-context';

export function useSharedComponent(id, version) {
	const components = useContext(SharedUIComponentsContext);
	const Component = useMemo(() => {
		const C = get(components, [id, 'versions', version]);
		if (C) {
			const SharedComponent = (props) => (
				<AppContextProvider pkg={components[id].pkg}>
					<C {...props} />
				</AppContextProvider>
			);
			return SharedComponent;
		}
		return null;
	}, [components, id, version]);
	return Component;
}
