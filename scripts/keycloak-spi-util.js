const config =  require('../package.json');
const exec = require('./util/exec');
const glob = require('glob');
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const he = require('he');

function build(spis = []) {
	const r = Promise.resolve(true);
	return spis.reduce(
		(p, spi) => p.then(() => exec(`mvn package -f ${spi}`)), 
		r
	);
}

function findArtifacts(spis = [], patterns = ['/**/target/*.jar']) {
		return spis.reduce((acc, spi) => {
			const found = patterns.reduce((acc, pattern) => {
				return [...acc, ...glob.sync(spi + pattern, {})];
			}, []);
			found.forEach(f => acc.push(f));
			return acc;
		}, []);
}

function copy() {
	const artifacts = findArtifacts();
	const r = Promise.resolve(true);
	return artifacts.reduce((p, artifact) => {
		return p.then(() => exec(`docker cp ${artifact} ${config.keycloak.container.name}:/opt/jboss/keycloak/standalone/deployments/`))
	}, r);
}

function copyModules() {
	const artifacts = findArtifacts();
	const r = Promise.resolve(true);
	return artifacts.reduce((p, artifact) => p.then(() => console.log(`Artifact:${artifact}`)), r);
}

function getDockerFileCopy(spis) {
	const artifacts = findArtifacts(spis);
	return artifacts.reduce((r, artifact) => r + `COPY ${artifact} /opt/jboss/keycloak/standalone/deployments/\n`, '');
}

function parseModuleXML(module) {
	return xmlParser.parse(fs.readFileSync(`${module}/module.xml`, 'utf8'),{
		attributeNamePrefix : "@_",
		attrNodeName: "attr", //default is 'false'
		textNodeName : "#text",
		ignoreAttributes : false,
		ignoreNameSpace : false,
		allowBooleanAttributes : false,
		parseNodeValue : true,
		parseAttributeValue : false,
		trimValues: true,
		cdataTagName: "__cdata", //default is 'false'
		cdataPositionChar: "\\c",
		parseTrueNumberOnly: false,
		arrayMode: false, //"strict"
		attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
		tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
		stopNodes: ["parse-me-as-string"]
	}, true);
}

function getDockerFileModuleCopy(modules) {
	return modules.reduce((r, {artifacts, moduleFolder, name}) => {
		return  r 
			+ artifacts.reduce((acc, artifact) =>  acc + `COPY ${artifact} /opt/jboss/keycloak/modules/system/layers/keycloak/${moduleFolder}/\n`, "")
			+ `COPY ${name}/module.xml /opt/jboss/keycloak/modules/system/layers/keycloak/${moduleFolder}/\n`

	},'');
}


function getModuleDetails(modules) {
	return modules.reduce((r, module) => {

		const jsonObj = parseModuleXML(module);	
		const resourceRoot = jsonObj.module.resources['resource-root'];
		
		const resourceListings = Array.isArray(resourceRoot) 
			? resourceRoot.map(v => '/**/target/**/' + v.attr['@_path']) 
			: ['/**/target/**/' + resourceRoot.attr['@_path']];

		const artifacts = findArtifacts([module], resourceListings);

		const packageName = jsonObj.module.attr['@_name'];
		const moduleFolder = `${packageName.replace(/\./g, '/')}/main`;
		r.push({
			name:module,
			artifacts,
			packageName,
			moduleFolder
		});
		return  r;
	},[]);
}

module.exports = { build, copy, copyModules, getDockerFileCopy, getDockerFileModuleCopy, getModuleDetails };
