package com.tmtek.keycloak;

import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.theme.Theme;

import org.jboss.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;

/**
 * This Provider renders a ftl Template when it is requested via 
 * an http GET request. The ftl template will be rendered as html 
 * text and returned.
 */
public class RouteProvider implements RealmResourceProvider {

	private Route route;

    public RouteProvider(final Route route) {
		this.route = route;
    }

    @GET
    @Produces("text/html; charset=UTF-8")
    public String get() {
		return "<html><body><h1>" + route.message + "</h1></body></html>";
	}

	public Object getResource() { return this; }

    public void close() {}
}