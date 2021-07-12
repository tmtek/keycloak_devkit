const fs = require('fs');
const copyfiles = require('copyfiles');
const replace = require('replace-in-file');
const dlv = require('dlv');
const packageJs =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');
const { build: buildSPIs, getDockerFileCopy, getDockerFileModuleCopy, getModuleDetails } = require('./keycloak-spi-util');
const detect = require('./keycloak-detect-authorables');

const authorables = detect();
const modules =  getModuleDetails(authorables.filter(a => a.type === 'module').map(a => a.path));
const spis = authorables.filter(a => a.type === 'spi').map(a => a.path);
const themes = authorables.filter(a => a.type === 'theme').map(a => a.path);

/* 
These commands are issued by default for all Docker instances of Keycloak.
*/
const startupCommands = [
	'/subsystem=keycloak-server/theme=defaults/:write-attribute(name=cacheThemes,value=false)',
	'/subsystem=keycloak-server/theme=defaults/:write-attribute(name=cacheTemplates,value=false)',
	'/subsystem=keycloak-server/theme=defaults/:write-attribute(name=staticMaxAge,value=-1)'
];

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

function populateArg(path, formatValue = v => !!v ? v : '') {
	const value = formatValue(dlv(packageJs, path));
	replace.sync({
		files:`./DockerFile`,
		from:`%${path}%`,
		to:value
	});

	replace.sync({
		files:`./docker-compose.yml`,
		from:`%${path}%`,
		to:value
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
	const internal = ['./docker-startup-commands.cli'];
	const keycloakStatic = glob.sync('./keycloak/scripts/*', {});
	const found = [...internal, ...keycloakStatic];
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

function populateModuleArtifacts() {
	replace.sync({
		files:`./Dockerfile`,
		from:`%modules%`,
		to:getDockerFileModuleCopy(modules)
	});

	modules.forEach(m => {
		startupCommands.push(`/subsystem=keycloak-server:list-add(name=providers, value=module:${m.packageName})`);
	});
}

function applyStartupCommands() {
	replace.sync({
		files:`./docker-startup-commands.cli`,
		from:`%commands%`,
		to:startupCommands.join("\n")
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
.then(copyAsync([
	'./scripts/resources/docker/docker-startup-commands.cli'
	], 
	'./', {up:3}
))
.then(() => buildSPIs([...modules.map(m=>m.name), ...spis]))

.then(() => {
	populateArg('keycloak.version', v => v ? `:${v}` : '');
	populateArg('keycloak.admin.username');
	populateArg('keycloak.admin.password');
	populateArg('keycloak.container.port');
	populateArg('keycloak.container.image');
	populateArg('keycloak.container.name');
	populateArg('keycloak.welcome.theme', v => !!v ? v : 'keycloak');
	populateArg('keycloak.defaultTheme', v => !!v ? v : 'keycloak');
	populateVolumes();
	populateRealms();
	populateSPIArtifacts();
	populateModuleArtifacts();
	applyStartupCommands();
})
.then(() => exec(`docker build ./ -t ${packageJs.keycloak.container.image}`));