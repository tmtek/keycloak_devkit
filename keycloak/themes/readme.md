# Static Keycloak Themes

This folder can contain any number of static Theme folders to be copied into the Keycloak container. A static Theme cannot be editted live. To do that, consider registering an authorable Theme in the `package.json` file.

When you issue the command `npm start` these Themes are all copied to Keycloak. If you add a new static Theme you do not need to rebuild the container, you can issue the `npm run update` command to copy it while the container is running.

You cannot remove static Themes once they have been added without rebuilding the container.