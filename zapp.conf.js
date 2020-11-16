// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

module.exports = {
	pkgName: 'com_zextras_zapp_shell',
	pkgLabel: 'Shell',
	pkgDescription: pkg.description,
	version: pkg.version,
	projectType: 'shell'
};
