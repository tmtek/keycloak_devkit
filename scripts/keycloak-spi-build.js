const { build } = require('./keycloak-spi-util');
const detect = require('./keycloak-detect-authorables');

const authorables = detect();
const spis = authorables.filter(a => a.type === 'spi' || a.type === 'module').map(a => a.path);
build(spis);