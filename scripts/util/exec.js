const util = require('util');
const systemExec = util.promisify(require('child_process').exec);
const packageJs =  require('../../package.json');

function isFunction(ref) {
	return typeof ref === 'function';
}

function exec(cmd) {
	return systemExec(isFunction(cmd) ? cmd(packageJs) : cmd).then(({ stdout, stderr }) => {
		console.log(stdout);
		console.log(stderr);
	});
}

module.exports = exec;