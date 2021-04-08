package com.tmtek.spi;

import java.util.Map;
import java.util.HashMap;
import java.io.IOException;

import org.keycloak.models.KeycloakSession;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.theme.FreeMarkerUtil;
import org.keycloak.theme.Theme;

import javax.ws.rs.GET;
import javax.ws.rs.Produces;

/**
 * This Provider renders a ftl Template when it is requested via 
 * an http GET request. The ftl template will be rendered as html 
 * text and returned.
 */
public class RouteProvider implements RealmResourceProvider {

	private final KeycloakSession session;
	private final FreeMarkerUtil freeMarker;
	private final FTLTemplate template;
	private final Map<String, Object> attributes = new HashMap<String, Object> ();


    public RouteProvider(KeycloakSession session, FreeMarkerUtil freeMarker, FTLTemplate template) {
		this.session = session;
		this.freeMarker = freeMarker;
		this.template = template;
    }

    @GET
    @Produces("text/html; charset=UTF-8")
    public String get() {
		if(session == null || session.theme() == null) return null;
		try {
			Theme theme = session.theme().getTheme(template.themeType);
			try {
				attributes.put("properties", theme.getProperties());
			} catch (IOException e) {}	
			attributes.putAll(template.attributes);
			template.onPopulate(attributes, session);
			String result = freeMarker.processTemplate(attributes, template.name, theme);
			return result;
		} catch (Exception e) {
			return null;
		}	
	}

	public Object getResource() { return this; }

    public void close() {}
}