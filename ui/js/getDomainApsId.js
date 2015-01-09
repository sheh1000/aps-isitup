define(["dojo/Deferred", 
		"dojo/_base/array",
		"aps/ResourceStore"], 
function ( Deferred, array, ResourceStore ) {

// This function returns the aps.id of the "http://aps-standard.org/types/dns/domain/1.0" by domain name
    return function (domainName) {
		
		var deferredResult = new Deferred();
	    var domainStore = new ResourceStore({
        apsType: "http://aps-standard.org/types/dns/domain/1.0",
        target: "/aps/2/resources/",
        idProperty: "aps.id"
    	});

	    var isitupDomNameArray = [];
	    domainStore.query().then(function(data) {
	        array.forEach(data, function(item) {
	        	//console.log(item.name);
	            if (item.name == domainName) { 
	            	isitupDomNameArray.push({name: item.name, apsId: item.aps.id});
	        	}
	        });
	        deferredResult.resolve(isitupDomNameArray);
	    });

        return deferredResult;
    };
	
});