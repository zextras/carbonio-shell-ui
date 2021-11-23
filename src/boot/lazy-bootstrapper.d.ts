import { any } from 'prop-types';
import { ReactElement } from 'react';

type LazyBootstrapperProps = {
	onBeforeBoot?: (ctxt: DevUtilsContext) => Promise<void>;
};

export default function (props: LazyBootstrapperProps): ReactElement<LazyBootstrapperProps>;
