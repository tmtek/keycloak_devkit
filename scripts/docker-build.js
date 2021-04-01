const fs = require('fs');
const copyfiles = require('copyfiles');
const replace = require('replace-in-file');
const dlv = require('dlv');
const packageJs =  require('../package.json');
const exec = require('./util/exec');

function copyFilesPromise(paths, options) {
	return new Promise((resolve) => {
		copyfiles(paths, options, resolve);
	});
}

function copyAsync(files = [], dest = './', options = {}) {
	return files.reduce((acc, file) => {
		return acc.then(() => copyFilesPromise([file, dest], options));
	}, Promise.resolve(true));
}

function populateArg(path) {
	replace.sync({
		files:`./DockerFile`,
		from:`%${path}%`,
		to:dlv(packageJs, path)
	});

	replace.sync({
		files:`./docker-compose.yml`,
		from:`%${path}%`,
		to:dlv(packageJs, path)
	});
}

function populateThemes() {
	const themes = packageJs.keycloak.themes.map(({dir, name}) => `      - "${dir}:/opt/jboss/keycloak/themes/${name}"`);
	replace.sync({
		files:`./docker-compose.yml`,
		from:`%volumes%`,
		to:themes.length > 0 ? 'volumes:\n' + themes.join('\n') : ''
	});
}

function populateRealms() {
	const relamsStr = fs.readdirSync('./keycloak/realms')
		.filter(file => file.match('\.json'))
		.map(file => `tmp/${file}`)
		.toString();

	replace.sync({
		files:`./Dockerfile`,
		from:`%realms%`,
		to:relamsStr
	});
}

copyAsync([
	'./scripts/resources/docker/Dockerfile',
	'./scripts/resources/docker/docker-compose.yml'
	], 
	'./', {up:3}
)
.then(() => {
	populateArg('keycloak.admin.username');
	populateArg('keycloak.admin.password');
	populateArg('keycloak.container.port');
	populateArg('keycloak.container.image');
	populateArg('keycloak.container.name');
	populateThemes();
	populateRealms();
})
.then(() => exec(`docker build ./ -t ${packageJs.keycloak.container.image}`));

