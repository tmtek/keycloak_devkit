# Keycloak Development Kit

This is a template project used to build and test Keycloak Themes and Service Provider Interfaces (SPIs). It can be used to easily standup a configurable instance of Keycloak using Docker and importing SPIs, Themes, and Realms. You may also use it to author themes and SPIs live with Keycloak running.

## Requirements

* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Docker](https://docs.docker.com/get-docker/)
* [Maven](https://maven.apache.org/install.html) (for SPI authroing)


## Commands
* `npm i`: Use this to download all dependencies for this project.
* `npm start`: Use this command to build and start a Keycloak Docker container using all of the supplied configurables.
* `npm stop`: Use this command to stop and remove the Keycloak Docker container.
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
		"admin": {
			"username": "admin",
			"password": "admin"
		},
		"themes": [
			{ "name":"DevTheme", "dir": "./src/example-theme"}
		],
		"spi":[
			"./src/example-spi"
		]
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

## Authoring SPIs

Keycloak [Service Provider Interfaces (SPIs)](https://www.keycloak.org/docs/latest/server_development/#_providers) can be easily mounted and tested using this project. They are .jar files that extend or add new capabilities.

### Static SPIs

Static SPIs are already completed and ready to drop in to Keycloak for use. You will be able to take the .jar files(and sometimes other files) and place them into one of the following folders:

* `keycloak/standalone/deployments` : Use the Keycloak Deployer(auto-magic!).
* `keycloak/modules` : Register manually as a Module.

More info on [why you would use one method over the other here](https://www.keycloak.org/docs/latest/server_development/#registering-provider-implementations).

All SPIs added using both methods will be added to Keycloak after issuing the `npm start` command. If you are doing 
SPI development and are frequently updating it for testing, you may drop the .jar file into the `keycloak/standalone/deployments` 
folder and issue a `npm run update` command to update the SPI live without having to re-build the Container. This only works with deployments and not SPIs added as Modules.


### Authorable SPIs

If you want to use this kit to test an SPI while you are developing it, you may drop the complete project for it into the `src` folder of this project. You will need to register the SPI in the package JSON file like so:

```
{
	"keycloak": {
		"spi":[
			"./src/example-spi"
		]
	}
}

```

You only need to specify the folder your SPI project resides in.

#### Build and Deploy your SPI

When the `npm run update` is issued and you have a registered authorable SPI the following will happen automagically:

* The project will be built using `mvn package`.
* Your generated .jar file will be identified and copied to Keycloak's deployments folder via Docker.
* Keycloak will initialize your SPI.
