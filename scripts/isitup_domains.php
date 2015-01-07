<?php
define('APS_DEVELOPMENT_MODE', true);
require_once "logger.php";
require_once "aps/2/runtime.php";

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
	
	
	/**
    * Method to get domain status from the isitup.org service
    * @verb(GET)
    * @path("/getstatus")
    * @param()
    */
	public function getstatus() {
		$this->logger("Retrieve domain status. Begin");

		$this->logger($this->isitup_domain->aps->id);
		function get_info($domain) {
        
        //$url = "http://isitup.org/" . $domain . ".json";
		$url = "http://isitup.org/" . "test.com" . ".json";
        
        $options = array(
                'http'=>array(
                'method'=>"GET",
                'header'=>"Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n" .
                "User-Agent:Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36\r\n" // as a browser
                )
        );

        $context = stream_context_create($options);

        //sending GET request and gettting the response
        $file = file_get_contents($url, false, $context);
        $this->logger("$file contains: " . $file);
        echo $file;
        //$obj =  json_decode($file, true);
        //header('Content-Type: application/json');
        //echo  json_encode($file);
        //return $obj->{$param};
}

get_info(htmlspecialchars($_GET["domain"]));

		$this->logger("Retrieve domain status. End");
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