import { filter, reduce } from 'lodash';
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
}: GetInfoResponse): Array<Account> => {
	const settings = normalizeSettings({ attrs, prefs, props });
	const apps = reduce<ZimletPkgDescription, AppPkgDescription[]>(
		filter<ZimletPkgDescription>(
			zimlets.zimlet,
			(z) => z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined'
		),
		(r, z) => [...r, zimletToAppPkgDescription(z)],
		[]
	);
	/*
	const themes = reduce<ZimletPkgDescription, ThemePkgDescription[]>(
		filter(
			zimlets.zimlet,
			(z) => z.zimlet[0].zapp === 'true' && typeof z.zimlet[0]['zapp-theme'] !== 'undefined'
		),
		(r, z) => [...r, zimletToThemePkgDescription(z)],
		[]
	);
	*/
	return [
		{
			id,
			name,
			displayName: attrs._attrs.displayName,
			apps,
			// themes,
			settings,
			identities,
			signatures
		}
	];
};
