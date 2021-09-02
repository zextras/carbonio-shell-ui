import { filter, reduce } from 'lodash';
import { CoreAppData } from '../../../types';
import { zimletToAppPkgDescription } from '../../network/soap/utils';
import { Account, AccountSettings, AppPkgDescription, GetInfoResponse } from './types';

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
	identities,
	signatures,
	props,
	version
}: GetInfoResponse): {
	account: Account;
	settings: AccountSettings;
	version: string;
} => {
	const settings = normalizeSettings({ attrs, prefs, props });
	return {
		account: {
			id,
			name,
			displayName: attrs._attrs.displayName,
			identities,
			signatures
		},
		settings,
		version
	};
};
