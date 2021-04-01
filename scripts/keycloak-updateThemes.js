const exec = require('./util/exec');
exec(config => `docker cp keycloak/themes/. ${config.keycloak.container.name}:/opt/jboss/keycloak/themes`);