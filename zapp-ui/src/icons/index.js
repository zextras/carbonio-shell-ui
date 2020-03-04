
import * as fillData from './fill';
import * as outlineData from './outline';
import * as customData from './custom';
import { Logo } from './logo'
export default { ...fillData, ...outlineData, ...customData, Logo };
