const fs = require('fs');
const copyfiles = require('copyfiles');
const replace = require('replace-in-file');
const dlv = require('dlv');
const packageJs =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');
const { build: buildSPIs, getDockerFileCopy } = require('./keycloak-spi-util');
const detect = require('./keycloak-detect-authorables');

const authorables = detect();
const spis = authorables.filter(a => a.type === 'spi').map(a => a.path);
const themes = authorables.filter(a => a.type === 'theme').map(a => a.path);

function filename(path) {
	const s = path.split('/');
	return s[s.length-1];
}

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
		to:dlv(packageJs, path, '')
	});

	replace.sync({
		files:`./docker-compose.yml`,
		from:`%${path}%`,
		to:dlv(packageJs, path, '')
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
	return themes.map((path) => `      - "${path}:/opt/jboss/keycloak/themes/${filename(path)}"`);
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

function populateSPIArtifacts() {
	replace.sync({
		files:`./Dockerfile`,
		from:`%spis%`,
		to:getDockerFileCopy(spis)
	});
}



copyAsync([
	'./scripts/resources/docker/Dockerfile',
	'./scripts/resources/docker/docker-compose.yml'
	], 
	'./', {up:3}
)
.then(() => buildSPIs(spis))
.then(() => {
	populateArg('keycloak.admin.username');
	populateArg('keycloak.admin.password');
	populateArg('keycloak.container.port');
	populateArg('keycloak.container.image');
	populateArg('keycloak.container.name');
	populateArg('keycloak.welcome.theme');
	populateVolumes();
	populateRealms();
	populateSPIArtifacts();
})
.then(() => exec(`docker build ./ -t ${packageJs.keycloak.container.image}`));

