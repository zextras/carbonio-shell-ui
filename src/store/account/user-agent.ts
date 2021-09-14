import UAParser from 'ua-parser-js';

const { os, browser } = UAParser();
export const userAgent = `CarbonioWebClient - ${browser.name} ${browser.version} (${os.name})`;
