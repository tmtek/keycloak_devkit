package com.tmtek.keycloak;

import org.keycloak.theme.Theme;

public class ExampleRoute extends RouteProviderFactory {

	public Route getRoute() {
		return new Route(
			"examplemodule", 
			"The Example Module Works!"
		);
	}
}