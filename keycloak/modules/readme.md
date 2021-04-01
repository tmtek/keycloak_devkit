# Import SPIs as Modules

This folder will contain all of the SPIs you are registering as a Module with Keycloak. [More on how to build SPIs as Modules here](https://www.keycloak.org/docs/latest/server_development/#register-a-provider-using-modules).

In order for modules to be placed properly in Keycloak, you must house them in a folder structure that reflects their packagename.

### Example

If I have built an SPI called `com.tmtek.idm.myspi` then I would place the module files here in a folder structure like this:


```
com/tmtek/idm/myspi/main/myspi-spi.jar
com/tmtek/idm/myspi/main/module.xml

```