package com.tmtek.spi;

import org.keycloak.theme.Theme;


/**
 * This route will load the welcome page (welcome.json).
 */
public class ExampleRoute extends RouteProviderFactory {

	public Route getRoute() {
		return new Route(
			"examplespi", 
			new FTLTemplate("helloworld.ftl", Theme.Type.LOGIN)
		);
	}
}