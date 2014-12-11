<?php
# It is the context of the subscription, in which a customer can manage its domains.
# It must correspond to a tenant created for the subscriber in the remote application system.
require "aps/2/runtime.php";

/**
* Class context
* @type("http://shelikhov.net/isitup2/context/1.0")
* @implements("http://aps-standard.org/types/core/resource/1.0")
*/

class context extends \APS\ResourceBase
{
## Strong relation (link) to the application instance
		
	/**
	* @link("http://shelikhov.net/isitup2/application/1.0")
	* @required
	*/
	public $application;
	
## Weak relation (link) to collection of domains
	/**
	 * @link("http://shelikhov.net/isitup2/isitup_domain/2.0[]")
	 */
	public $isitup_domain;
	
## Strong relation with the Subscription.
## This way, we allow the service to access the operation resources
## with the limits and usage defined in the subscription.

	/**
	* @link("http://aps-standard.org/types/core/subscription/1.0")
	* @required
	*/
    public $subscription;

## Link to the account type makes account attributes available to the service,
## e.g., the account (subscriber) name, and all its other data.

	/**
	* @link("http://aps-standard.org/types/core/account/1.0")
    	* @required
    	*/
    public $account;

}
?>
