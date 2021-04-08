const fs = require('fs');
const copyfiles = require('copyfiles');
const replace = require('replace-in-file');
const dlv = require('dlv');
const packageJs =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');

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

function populateVolumes() {
	const volumes = [...getThemes(), ...getScripts()];
	replace.sync({
		files:`./docker-compose.yml`,
		from:`%volumes%`,
		to:volumes.length > 0 ? 'volumes:\n' + volumes.join('\n') : ''
	});
}

function getThemes() {
	const themes = dlv(packageJs, 'keycloak.themes', [])
	return themes.map(({dir, name}) => `      - "${dir}:/opt/jboss/keycloak/themes/${name}"`);
}

function getScripts() {
	const found = glob.sync('./scripts/resources/docker/scripts/*', {});
	return found ? found.map(f => {
		const filenamePath = f.split('/');
		const filename = filenamePath[filenamePath.length-1];
		return `      - ${f}:/opt/jboss/startup-scripts/${filename}`
	}): [];
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
	populateVolumes();
	populateRealms();
})
.then(() => exec(`docker build ./ -t ${packageJs.keycloak.container.image}`));

