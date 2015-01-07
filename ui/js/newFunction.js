define(["aps/Memory", "aps/ResourceStore", "dojo/Deferred"], function (Memory, Store, Deferred) {

    return function (param1) {
		if (!param1) {
            param1 = 0;
        }
		
		var deferredResult = new Deferred();
		
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