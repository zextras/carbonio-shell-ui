import { AppPackageDescription } from '../extension/IExtensionService';

export interface IShellNetworkService {
	getApps(): Promise<AppPackageDescription[]>;
}
