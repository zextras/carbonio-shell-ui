import React, { useCallback } from 'react';
import { Catcher } from '@zextras/zapp-ui';

export default function AppErrorCatcher({ children }) {
	const onError = useCallback((error) => {
		// ({event: 'report-exception',data: { exception: error }});
	}, []);
	return <Catcher onError={onError}>{children}</Catcher>;
}
