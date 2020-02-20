import { IShellNetworkService } from './IShellNetworkService';
import { filter, map } from 'lodash';
import { AppPackageDescription } from '../extension/IExtensionService';
import { IGetInfoResponse, ISoapResponse } from './ISoap';

export default class ShellNetworkService implements IShellNetworkService {

	getApps(): Promise<AppPackageDescription[]> {
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

}
