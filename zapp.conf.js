// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json');

module.exports = {
	pkgName: pkg.zapp.zipname,
	pkgLabel: 'Zextras Shell',
	pkgDescription: pkg.description,
	version: pkg.version,
	projectType: 'shell'
};
