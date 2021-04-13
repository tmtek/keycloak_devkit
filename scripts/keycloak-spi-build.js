const { build, copy } = require('./keycloak-spi-util');
build().then(() => copy());