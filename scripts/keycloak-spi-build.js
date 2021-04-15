const { build, copy } = require('./keycloak-spi-util');
const detect = require('./keycloak-detect-authorables');

const authorables = detect();
const spis = authorables.filter(a => a.type === 'spi').map(a => a.path);
build(spis).then(() => copy());