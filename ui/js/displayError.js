define(["dijit/registry", "aps/Message", "aps/PageContainer"],
    function (registry, Message, PageContainer) {
        return function(err) {
            var errData = err.response ? JSON.parse(err.response.text) : { message: err };
                console.log(errData);
                console.log("errrrr");
            aps.apsc.cancelProcessing();

            var page = registry.byId("page");
            if(!page){
                page = new PageContainer({ id: "page" });
                page.placeAt(document.body, "first");
            }
            var messages = page.get("messageList");
            /* Remove all current messages from the screen */
            messages.removeAll();
            /* And display the new message */
            messages.addChild(new Message({description: err + (errData.message ? "" : "<br />" + errData.message), type: "error"}));
        // messages.addChild(new Message({description: err + (errData.message ?
        //                     "<br />" + errData.message : ""), type: "error"}));
        //                    that's the initial one, does not work for manually generated errors, TODO
        };
    }
);
