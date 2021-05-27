const detect = require('./keycloak-detect-authorables');
const buildRpm = require('rpm-builder');
const config = require('../package.json');

const KEYCLOAK_THEMES_DIR = '/opt/jboss/keycloak/themes';

function filename(path) {
	const s = path.split('/');
	return s[s.length-1];
}

/**
 * Will locate all themes in the src folder and 
 * package their contents into an RPM for 
 * installation into Keycloak.
 */
function packageThemes() {
	const authorables = detect();
	const themes = authorables.filter(a => a.type === 'theme').map(a => a.path);
	buildRpm({
		rpmDest: './build',
		tempDir:'./build/tmp',
		name: config.name,
		version: process.env.BUILDID || config.version,
		release: process.env.RELEASE ||'1',
		buildArch: 'noarch',
		files:themes.map(theme => {
			const name = filename(theme);
			return ({cwd: theme, src: '**/*.*', dest: `${KEYCLOAK_THEMES_DIR}/${name}`})
		})
	}, function(err, rpm) {
		if(err) console.log(err || rpm);
	});
}

packageThemes();