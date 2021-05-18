package com.tmtek.spi;

import org.keycloak.theme.Theme;

public class ExampleRoute extends RouteProviderFactory {

	public Route getRoute() {
		return new Route(
			"examplespi", 
			"The Example SPI Works!"
		);
	}
}