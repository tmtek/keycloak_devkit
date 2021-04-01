# Import Realms

Existing Realms can be exported as a JSON file from Keycloak. Those files can then be placed in this folder to cause this Keycloak container to import them.

Realms are often configured to leverage custom configuration, Themes, and SPIs which are imported separately. Ensure that you have also imported all of those dependencies so that your Realm works properly.