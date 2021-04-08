package com.tmtek.spi;

import org.keycloak.theme.Theme;
import java.util.Map;
import java.util.HashMap;
import org.keycloak.models.KeycloakSession;

/**
 * Used to specify the location and arguments to load an FTL template.
 */
public class FTLTemplate {

	/**
	 * Implement this interface on objects that you intend to submit to an 
	 * FTL template as data. Any child objects of the returned Map should also 
	 * implement this interface.
	 */
	public static interface IFTLData {
		public Map<String,Object> toFTLData();
	}
	
	/**
	 * The filename of the ftl template.
	 */
	public final String name;

	/**
	 * The theme type where this FTL template resides: login, account, admin, etc.
	 */
	public final Theme.Type themeType;

	/**
	 * Data that is injected into the FTL template when rendered.
	 */
	public final Map<String, Object> attributes = new HashMap<String, Object> ();

	public FTLTemplate(final String name, final Theme.Type themeType) {
		this.name = name;
		this.themeType = themeType;
	}

	/**
	 * Add a string attribute this this FTL template will utilize when rendering.
	 */
	public FTLTemplate attribute(final String name, final String value) {
		this.attributes.put(name, value);
		return this;
	}

	/**
	 * Add an object attribute this this FTL template will utilize when rendering.
	 * Value must implement the IFTLData interface. Children of the returned map 
	 * must also implement IFTLData if they are objects.
	 */
	public FTLTemplate attribute(final String name, final IFTLData value) {
		this.attributes.put(name, value.toFTLData());
		return this;
	}

	/**
	 * Called when the system is actually rendering the template and has a session 
	 * active. Override this method to inject in any data needed in the FTL template.
	 * @param attributes The current attributes being passed into the template.
	 * @param session The current Keycloak Session.
	 */
	public void onPopulate(final Map<String, Object> attributes, final KeycloakSession session) {
		
	}
}