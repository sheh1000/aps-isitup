define(["dojo/Deferred", 
		"dojo/_base/array",
		"aps/ResourceStore"], 
function ( Deferred, array, ResourceStore ) {

// this function gets the domain name and returns resource ID of the type http://shelikhov.net/isitup2/isitup_domain/2.0
    return function (domainName) {
		
		var deferredResult = new Deferred();

	    var domainStore = new ResourceStore({
        apsType: "http://shelikhov.net/isitup2/isitup_domain/2.0",
        target: "/aps/2/resources/",
        idProperty: "aps.id"
    	});

	    var resourceID = "";
	    domainStore.query().then(function(data) {
	        array.forEach(data, function(item) {
	        	//console.log(item.name);
	            if (item.name == domainName) { 
	            	resourceID = item.aps.id;
	        	}
	        });
	        deferredResult.resolve(resourceID);
	    });

        return deferredResult;
    };
	
});