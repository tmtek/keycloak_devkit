# Keycloak Development Kit

This is a template project used to build and test Keycloak Themes and [Service Provider Interfaces (SPIs). It can be used to easily standup an configurable instance of Keycloak using Docker and import SPIs, Themes, and Realms. You may also use it to author themes live with Keycloak running.


## Commands
* `npm i`: Use this to download all dependencies for this project.
* `npm start`: Use this command to build and start a Keycloak Docker container using all of the supplied configurables.
* `npm run clean`: Use this command to remove the Keycloak Docker container.
* `npm run update`: Re-copies all static themes, and SPIs to the Keycloak Docker container.


## Configuring the Keycloak Container
 
The Keycloak instance is configured using the keycloak object of the `package.json` file for this project:

```
{
	"keycloak": {
		"container": {
			"port": "9001",
			"image":"keycloak:dev",
			"name":"KeycloakDevKit"
		},
		"themes": [
			{ "name":"DevTheme", "dir": "./src"}
		],
		"admin": {
			"username": "admin",
			"password": "admin"
		}
	}
}
```

### Configurables

In the [/keycloak](keycloak) folder of this project, there are folders that allow you to supply assets to extend Keycloak's capabilities:

* [Configuration](keycloak/standalone/configuration): Full configuration file for the Keycloak application.
* [Deployments](keycloak/standalone/deployments): Hot mounted Keycloak SPIs.
* [Modules](keycloak/modules): Registered Keycloak SPIs.
* [Themes](keycloak/themes): Assets that change the way Keycloak looks to end-users.
* [Realms](keycloak/realms): Import pre-made realms.


## Authoring Themes

This project can be used to easily author Keycloak Themes that can be previewed live as you edit in Keycloak. You must register any theme you are authoring in the `package.json`:

```
{
	"keycloak": {
		"themes": [
			{ "name":"DevTheme", "dir": "./src"}
		]
	}
}
```

In the example above, the `src` folder is registered as the container for a new theme called **DevTheme**. You could author many themes at once by registering the following:

```
{
	"keycloak": {
		"themes": [
			{ "name":"Theme 1", "dir": "./src/theme1"},
			{ "name":"Theme2", "dir": "./src/theme2"}
		]
	}
}
```

[Details on building and extending Themes can be found here](https://www.keycloak.org/docs/latest/server_development/#_themes).


## Testing SPIs

Keycloak [Service Provider Interfaces (SPIs)](https://www.keycloak.org/docs/latest/server_development/#_providers) can be easily mounted and tested using this project. They are .jar files that extend or add new capabilities.

There are two different ways to register them:

* `keycloak/standalone/deployments` : Use the Keycloak Deployer(auto-magic!).
* `keycloak/modules` : Register manually as a Module.

More info on [why you would use one method over the other here](https://www.keycloak.org/docs/latest/server_development/#registering-provider-implementations).
