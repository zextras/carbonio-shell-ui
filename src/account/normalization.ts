import { filter, reduce } from 'lodash';
import { CoreAppData } from '../../types';
import { zimletToAppPkgDescription } from '../network/soap/utils';
import {
	Account,
	AccountSettings,
	AppPkgDescription,
	GetInfoResponse,
	ZimletPkgDescription
} from './types';

const normalizeSettings = (
	settings: Pick<GetInfoResponse, 'attrs' | 'prefs' | 'props'>
): AccountSettings => ({
	attrs: settings.attrs._attrs,
	prefs: settings.prefs._attrs,
	props: settings.props.prop
});

export const normalizeAccount = ({
	id,
	name,
	attrs,
	prefs,
	zimlets,
	identities,
	signatures,
	props
}: GetInfoResponse): { account: Account; settings: AccountSettings; apps: Array<CoreAppData> } => {
	const settings = normalizeSettings({ attrs, prefs, props });
	const apps = reduce<ZimletPkgDescription, AppPkgDescription[]>(
		filter<ZimletPkgDescription>(
			zimlets.zimlet,
			(z) => z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined'
		),
		(r, z) => [...r, zimletToAppPkgDescription(z)],
		[]
	);

	return {
		account: {
			id,
			name,
			displayName: attrs._attrs.displayName,
			identities,
			signatures
		},
		settings,
		apps
	};
};
