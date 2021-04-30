# Keycloak Development Kit

This is a template project used to build and test Keycloak Themes and Service Provider Interfaces (SPIs). It can be used to easily standup a configurable instance of Keycloak using Docker and importing SPIs, Themes, and Realms. You may also use it to author themes and SPIs live with Keycloak running.

## Requirements

* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Docker](https://docs.docker.com/get-docker/)
* [Maven](https://maven.apache.org/install.html) (for SPI authoring)


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
		"version":"10.0.2"
		"container": {
			"port": "9001",
			"image":"keycloak:dev",
			"name":"KeycloakDevKit"
		},
		"admin": {
			"username": "admin",
			"password": "admin"
		},
		"welcome":{
			"theme":"DevTheme"
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

#### SPIs

For SPIs that are already completed and ready for use, you will be able to take the .jar files(and sometimes other files) and place them into one of the following folders:

* `keycloak/standalone/deployments` : Use the Keycloak Deployer(auto-magic!).
* `keycloak/modules` : Register manually as a Module.

More info on [why you would use one method over the other here](https://www.keycloak.org/docs/latest/server_development/#registering-provider-implementations).

While keycloak is running, issuing the `npm run update` command will re-copy the SPIs to Keycloak without having to re-build the Container. This only works with deployments and not SPIs added as Modules.


## Authorables

You can use this kit to author **Keycloak Themes** and **Keycloak SPIs**. You may work on one or many all in this project at the same time. You add authorable projects to the `src` folder of this project. For example:

```
/src/example-theme
/src/example-theme2
/src/example-spi
```
would mean that you have 2 authorable themes (example-theme, example-theme2) and 1 authorable SPI. 



### Themes

This project can be used to easily author Keycloak Themes that can be previewed live as you edit in Keycloak. Themes are comprised of one or more of the following sub-folders:

* login : Screens presented as a user logs in.
* account : Screens presented as a user reviews and updates their personal information.
* admin : Screens presented for the administration of Keycloak itself.
* welcome : The screen presented when the user visits the Keycloak root URL.

Themes are composed using FTL Templates, CSS, Javascript, and properties files.

[Details on building and extending Themes can be found here](https://www.keycloak.org/docs/latest/server_development/#_themes).

[Keycloak Base Theme](https://github.com/keycloak/keycloak/tree/master/themes/src/main/resources/theme/base) : This is the base theme for Keycloak that most other themes extend. Having this can be useful when building totally new user interfaces to replace the standard ones.

### SPIs

Keycloak [Service Provider Interfaces (SPIs)](https://www.keycloak.org/docs/latest/server_development/#_providers) can be easily mounted and tested using this project. They are .jar files that extend or add new capabilities.


If you want to use this kit to test an SPI while you are developing it, you may drop the complete Maven project for it into the `src` folder of this project.

When the `npm run update` is issued and you have an authorable SPI the following will happen automagically:

* The project will be built using `mvn package`.
* Your generated .jar file will be identified and copied to Keycloak's deployments folder via Docker.
* Keycloak will initialize your SPI.
