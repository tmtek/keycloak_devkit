package com.tmtek.spi;

/**
 * Used to map a route for Keycloak to a FTL template to render.
 */
public class Route {
	
	/**
	 * The path/route where you want the template to render.
	 * EG: <yourServerUri>/route
	 */
	public final String route;
	/**
	 * The FTL Template to render at this route.
	 */
	public final FTLTemplate template;

	public Route(final String route, final FTLTemplate template) {
		this.route = route;
		this.template = template;
	}
}