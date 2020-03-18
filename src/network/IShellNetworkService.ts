import { AppPackageDescription } from '../extension/IExtensionService';
import { IStoredAccountData, IStoredSessionData } from '../idb/IShellIdbSchema';
import { IGetInfoResponse } from './ISoap';

export interface IShellNetworkService {
	getApps(): Promise<AppPackageDescription[]>;
	getThemes(): Promise<AppPackageDescription[]>;
	doLogin(username: string, password: string): Promise<[IStoredSessionData, IStoredAccountData]>;
	doLogout(): Promise<void>;
	getAccountInfo(): Promise<IGetInfoResponse>;
	validateSession(sessionData: IStoredSessionData): Promise<IStoredSessionData>;
}
