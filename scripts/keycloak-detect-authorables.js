const fs = require('fs');
const glob = require('glob');

function details(path) {
	const found = glob.sync(`${path.path || path}/*`, {});
	return {path: path.path || path, children:found.map(f => {
		const isDirectory = fs.lstatSync(f).isDirectory();
		return {path:f, dir:isDirectory};
	})};
}

function dirs(details) {
	return details.children.filter(d => d.dir);
}

function name(detail) {
	const s = detail.path.split('/');
	return s[s.length-1];
}

function detectType(details) {
	const type = isModule(details) || isSPI(details) || isTheme(details) || 'none';
	return {path:details.path, type};
}

function isSPI(details) {
	return details.children.filter(d => d.path.match(/pom\.xml/) !== null).length > 0 && 'spi';
}

function isModule(details) {
	return details.children.filter(d => d.path.match(/module\.xml/) !== null).length > 0 && 'module';
}

function isTheme(details) {
	return details.children.filter(d => d.dir)
	 	.filter(d => {
			const fname = name(d);
			return fname === 'login' 
				|| fname === 'account'
				|| fname === 'admin'
				|| fname === 'welcome';
		 })
		.length > 0 && 'theme';
}

function detect() {
	const src = details('./src');
	const srcType = detectType(src);
	if(detectType(src).type !== 'none') {
		return [srcType];
	}
	return dirs(src)
		.map(d => detectType(details(d)))
}

module.exports = detect;