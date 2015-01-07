define(["dojo/Deferred", "dojo/request/xhr"], function (  Deferred, dojoxhr ) {

    return function (domainName) {
		
		var deferredResult = new Deferred();
		deferredResult = dojoxhr("https://endpoint.only.dshelikhov.apsdemo.org/isitup1/parse.php?domain=" + domainName, { 
			method: "GET", 
			handleAs: "json"
		});

		  deferredResult.then(function(value){
			// Do something when the process completes
			deferredResult.resolve(value);
		  }, function(err){
			// Do something when the process errors out
			deferredResult.reject(err);
		  }, function(update){
			// Do something when the process provides progress information
		  });
        return deferredResult;
    };
	
});