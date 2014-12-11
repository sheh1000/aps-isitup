<?php

require "aps/2/runtime.php";

/**
* @type("http://shelikhov.net/isitup2/isitup_domain/2.0")
* @implements("http://aps-standard.org/types/core/resource/1.0")
*/
class isitup_domain extends APS\ResourceBase {
	
	/**
     * @link("http://shelikhov.net/isitup2/context/1.0")
     * @required
    */
    public $context;
	
	/**
	* @link("http://aps-standard.org/types/dns/domain/1.0")
	*/
	public $apsdomain;
	
	/**
	* @type(string)
	* @title("name")
	* Description("Domain name")
	*/
	public $name;
	
	/**
	* @type(string)
	* @title("status")
	* @Description("Domain status")
	*/
	public $status;
		
	
	public function provision(){
		$this->activate_domain();
	}
	
	public function unprovision(){
		$this->deactivate_domain();
	}
	
	public function configure($new = null){
		$new->update_domain();
	}
	
	public function retrieve() {
	}
	
	public function activate_domain(){
		// ACTIVATE DOMAIN
	}

	public function update_domain( ){
		// UPDATE DOMAIN
	}
	
	public function deactivate_domain(){
		// DEACTIVATE DOMAIN
	}
	
}/*end class*/