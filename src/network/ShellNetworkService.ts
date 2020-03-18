import { IShellNetworkService } from './IShellNetworkService';
import { filter, map } from 'lodash';
import { AppPackageDescription } from '../extension/IExtensionService';
import { IGetInfoResponse, ISoapResponse } from './ISoap';
import { IStoredAccountData, IStoredSessionData } from '../idb/IShellIdbSchema';

export default class ShellNetworkService implements IShellNetworkService {

	public getApps(): Promise<AppPackageDescription[]> {
		return fetch(
				'/service/soap/GetInfoRequest',
				{
					method: 'POST',
					body: JSON.stringify({
						Body: {
							GetInfoRequest: {
								_jsns: 'urn:zimbraAccount',
								sections: 'zimlets'
							}
						}
					})
				}
			)
				.then((resp) => resp.json())
				.then((response) => {
					if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
					return response;
				})
				.then((resp: ISoapResponse<IGetInfoResponse>) => map<any, AppPackageDescription>(
					filter(
						resp.Body.GetInfoResponse.zimlets.zimlet,
						(z) => z.zimlet[0]['zapp'] === 'true' && typeof z.zimlet[0]['zapp-main'] !== 'undefined'
					),
					(z) => ({
						package: z.zimlet[0].name,
						name: z.zimlet[0].label,
						description: z.zimlet[0].description,
						version: z.zimlet[0].version,
						resourceUrl: `/zx/zimlet/${ z.zimlet[0].name }`,
						entryPoint: z.zimlet[0]['zapp-main']!,
						styleEntryPoint: z.zimlet[0]['zapp-style'],
						serviceworkerExtension: z.zimlet[0]['zapp-serviceworker-extension']
					})
				));
	}

	public getThemes(): Promise<AppPackageDescription[]> {
		return fetch(
			'/service/soap/GetInfoRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						GetInfoRequest: {
							_jsns: 'urn:zimbraAccount',
							sections: 'zimlets'
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((resp: ISoapResponse<IGetInfoResponse>) => map<any, AppPackageDescription>(
				filter(
					resp.Body.GetInfoResponse.zimlets.zimlet,
					(z) => z.zimlet[0]['zapp'] === 'true' && typeof z.zimlet[0]['zapp-theme'] !== 'undefined'
				),
				(z) => ({
					package: z.zimlet[0].name,
					name: z.zimlet[0].label,
					description: z.zimlet[0].description,
					version: z.zimlet[0].version,
					resourceUrl: `/zx/zimlet/${z.zimlet[0].name}`,
					entryPoint: z.zimlet[0]['zapp-theme']!
				})
			));
	}

	public getAccountInfo(): Promise<IGetInfoResponse> {
		return fetch(
			'/service/soap/GetInfoRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						GetInfoRequest: {
							_jsns: 'urn:zimbraAccount'
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((response) => response.Body.GetInfoResponse);
	}

	public doLogin(username: string, password: string): Promise<[IStoredSessionData, IStoredAccountData]> {
		return fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							account: {
								by: 'name',
								_content: username
							},
							password: {
								_content: password
							},
							prefs: [
								{ pref: { name: 'zimbraPrefMailPollingInterval' } },
							]
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
			.then((authResp) => authResp.Body.AuthResponse)
			.then((authResp) => {
				return this.getAccountInfo()
					.then((getInfoResp) => ([
						{
							id: getInfoResp.id,
							authToken: authResp.authToken[0]._content,
							username: getInfoResp.name
						},
						{
							id: getInfoResp.id,
							u: username,
							p: password
						}
					]));
			});
	}

	public doLogout(): Promise<void> {
		return fetch(
			'/service/soap/EndSessionRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						EndSessionRequest: {
							_jsns: 'urn:zimbraAccount',
							logoff: '1'
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return response;
			})
	}

	public validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData> {
		return fetch(
			'/service/soap/AuthRequest',
			{
				method: 'POST',
				body: JSON.stringify({
					Body: {
						AuthRequest: {
							_jsns: 'urn:zimbraAccount',
							account: {
								by: 'id',
								_content: sessionData.id
							},
							authToken: {
								verifyAccount: '1',
								_content: sessionData.authToken
							},
							prefs: [
								{ pref: { name: 'zimbraPrefMailPollingInterval' } },
							]
						}
					}
				})
			}
		)
			.then((resp) => resp.json())
			.then((response) => {
				if (response.Body.Fault) throw new Error(response.Body.Fault.Reason.Text);
				return sessionData;
			})
	}

}
