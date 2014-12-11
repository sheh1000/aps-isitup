<?php

require "aps/2/runtime.php";

/**
 * Class application presents application and its global parameters
 * @type("http://shelikhov.net/isitup2/application/1.0")
 * @implements("http://aps-standard.org/types/core/application/1.0")
 */
class application extends APS\ResourceBase {
# Link to collection of contexts. Pay attention to [] brackets at the end of the @link line.
	/**
	 * @link("http://shelikhov.net/isitup2/context/1.0[]")
	 */
	public $contexts;

# Global connection settings will be configured by the provider
# Must be forwarded to the app end-point to set the connection with the external system
	/**
        * @type(string)
        * @title("apphost")
        * @description("Cloud management server IP or domain name")
        */
        public $apikey;

}
