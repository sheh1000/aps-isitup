define(["dojo/Deferred", "aps/xhr"], function (  Deferred, xhr ) {

    return function (apsID) {
		
		var deferredResult = new Deferred();
		deferredResult = xhr("/aps/2/resources/" + apsID + "/getstatus", { 
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