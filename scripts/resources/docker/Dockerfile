FROM jboss/keycloak%keycloak.version%

# Add SPIs and Modules:
COPY keycloak/modules/ /opt/jboss/keycloak/modules/system/layers/keycloak/
COPY keycloak/standalone/deployments/ /opt/jboss/keycloak/standalone/deployments/

# Add Authorable SPIs:
%spis%

# Add pre-installed themes: 
COPY keycloak/themes/ /opt/jboss/keycloak/themes/

# Apply Keycloak configuration:
COPY keycloak/standalone/configuration/ /opt/jboss/keycloak/standalone/configuration/

# Import Realm:
COPY keycloak/realms/ tmp/
ENV KEYCLOAK_IMPORT=%realms%

# Set admin credentials:
ENV KEYCLOAK_USER=%keycloak.admin.username%
ENV KEYCLOAK_PASSWORD=%keycloak.admin.password%

# Apply Theme Settings:
ENV KEYCLOAK_WELCOME_THEME=%keycloak.welcome.theme%
ENV KEYCLOAK_DEFAULT_THEME=%keycloak.defaultTheme%