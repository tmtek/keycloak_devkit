const config =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');

function build() {
	const r = Promise.resolve(true);
	return config.keycloak.spi ? config.keycloak.spi.reduce(
		(p, spi) => p.then(() => exec(`mvn package -f ${spi}`)), 
		r
	) : r;
}

function findArtifacts() {
	if(config.keycloak.spi) {
		return config.keycloak.spi.reduce((acc, spi) => {
			const found = glob.sync(spi + '/**/target/*.jar', {});
			found.forEach(f => acc.push(f));
			return acc;
		}, []);
	}
	return [];
}

function copy() {
	const artifacts = findArtifacts();
	const r = Promise.resolve(true);
	return artifacts.reduce((p, artifact) => p.then(() => exec(`docker cp ${artifact} ${config.keycloak.container.name}:/opt/jboss/keycloak/standalone/deployments/`)), r);
}

function getDockerFileCopy() {
	const artifacts = findArtifacts();
	return artifacts.reduce((r, artifact) => r + `COPY ${artifact} /opt/jboss/keycloak/standalone/deployments/\n`, '');
}

module.exports = { build, copy, getDockerFileCopy };
