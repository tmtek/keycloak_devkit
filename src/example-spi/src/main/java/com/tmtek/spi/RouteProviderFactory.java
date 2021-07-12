package com.tmtek.spi;


import org.keycloak.Config.Scope;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resource.RealmResourceProviderFactory;
import org.keycloak.theme.FreeMarkerUtil;

/**
 * Extend this class to add a new route to keycloak and render a 
 * ftl template where it is requested.
 */
public abstract class RouteProviderFactory implements RealmResourceProviderFactory {

	private Route route;

    public String getId() {
        return getCachedRoute().route;
	}
	
	private Route getCachedRoute() {
		if(route == null) {
			route = getRoute();
		}
		return route;
	}

	/**
	 * Override this method to provide the data needed to render 
	 * a ftl template at the specified route.
	 */
	protected abstract Route getRoute();


    public RealmResourceProvider create(KeycloakSession session) {
		return new RouteProvider(getCachedRoute());
    }

    public void init(Scope config) {}

	public void close() {}
	
	public void postInit(KeycloakSessionFactory factory) {}
}