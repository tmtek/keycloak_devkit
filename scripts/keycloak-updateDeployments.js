const exec = require('./util/exec');
exec(config => `docker cp keycloak/standalone/deployments/. ${config.keycloak.container.name}:/opt/jboss/keycloak/standalone/deployments`);