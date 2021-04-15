const config =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');

function build(spis = []) {
	const r = Promise.resolve(true);
	return spis.reduce(
		(p, spi) => p.then(() => exec(`mvn package -f ${spi}`)), 
		r
	);
}

function findArtifacts(spis = []) {
		return spis.reduce((acc, spi) => {
			const found = glob.sync(spi + '/**/target/*.jar', {});
			found.forEach(f => acc.push(f));
			return acc;
		}, []);
}

function copy() {
	const artifacts = findArtifacts();
	const r = Promise.resolve(true);
	return artifacts.reduce((p, artifact) => p.then(() => exec(`docker cp ${artifact} ${config.keycloak.container.name}:/opt/jboss/keycloak/standalone/deployments/`)), r);
}

function getDockerFileCopy(spis) {
	const artifacts = findArtifacts(spis);
	return artifacts.reduce((r, artifact) => r + `COPY ${artifact} /opt/jboss/keycloak/standalone/deployments/\n`, '');
}

module.exports = { build, copy, getDockerFileCopy };
