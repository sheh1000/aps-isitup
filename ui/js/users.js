require([
    "aps/ResourceStore",
    "dojo/when",
    "dojo/Deferred",
    "dojo/promise/Promise",
    "dojo/promise/all",
    "dojo/_base/array",
    "dojo/request/xhr",
    "dojox/mvc/getStateful",
    "aps/Memory",
    "aps/xhr",
    "dijit/registry",
    "aps/load",
    "./js/displayError.js",
    "./js/getDomains.js",
    "./js/getStatus.js",
    "./js/getDomainApsId.js",
    "./js/getResourceId.js",
    "aps/ready!"],
function (ResourceStore, when, Deferred, Promise, all, array, dojoxhr, getStateful, Memory, xhr, registry, load, displayError, getDomains, getStatus, getDomainApsId, getResourceId) {

    // creating a modelUser object skeleton to be filled later from user selections
    var modelUser =  getStateful({
        aps: {type: "http://shelikhov.net/isitup2/isitup_domain/2.0"},
        dom_id: "",
        name: "",
        status: "",
        apsdomain: { aps: { id: "" } }
    });

    var domainStore = new ResourceStore({
        apsType: "http://aps-standard.org/types/dns/domain/1.0",
        target: "/aps/2/resources/",
        idProperty: "aps.id"
    });


    var isitup_domainStore = new ResourceStore({
        apsType: "http://shelikhov.net/isitup2/isitup_domain/2.0",
        target: "/aps/2/resources/",
        idProperty: "aps.id"
    });
    
    var storeArray=[];
    var store = new Memory({data: storeArray});

    // creating a resource store to add the user later, target can be either the collection 'users' in organization resource
    // or just /aps/2/resources but in this case link to organization needs to be specified manually in model for new user
    var storeAddDomain = new ResourceStore({
        target: "/aps/2/resources/" + aps.context.vars.context.aps.id + "/isitup_domain"
    });


   var widgets =
    ["aps/PageContainer", [
        ["aps/Grid", {
            id: "grid",
            columns: [
                {name: "POA domain", field: "name"},
                {name: "Monitoring", field: "monitoring"},
                {name: "Status", field: "status"}
                ],
            store: store,
            // selectionMode defines whether the selector will be a radiobutton ('single') or checkbox ('multiple')
            selectionMode: "multiple",
            // Id of an APS view of a "detail" view in the "master-detail" scenario. 
            // If this attribute is defined, a column with type: 'resourceName' will be rendered as a link. 
            // After clicking this link a user will be automatically redirected to a view with apsResourceViewId
            // note that this view should have variable defined in APP-META.xml to hold the resource selected in aps/Grid
            apsResourceViewId: "user-edit"},
            
            [["aps/Toolbar", [
                ["aps/ToolbarButton", {
                        label: "Add New Domain to watch",
                        iconClass: "sb-add-new",
                        // autoBusy: false means the button will not be disabled after clicking - no need to call cancel() in onClick handler
                        autoBusy: false,
                        onClick: function() {
                            // to operate on grid's data we need to find what was selected
                            var grid = registry.byId("grid");
                            var sel = grid.get("selectionArray");

                            for (var i=0; i<sel.length; i++) {
                                var isResult = getDomainApsId(store.get(sel[i]).name);
                                isResult.then(function(arrayResult) {

                                    modelUser.name =  arrayResult[0].name;
                                    modelUser.dom_id = arrayResult[0].apsId;
                                    modelUser.apsdomain.aps.id = arrayResult[0].apsId;
                                    
                                    getResourceId(modelUser.name).then(function(resultResID){
                                        
                                        console.log("resultResID.length");
                                        console.log(resultResID.length);

                                        if (resultResID.length == 0) { // add resource only if it is not existing
                                           when(storeAddDomain.put(modelUser), function() {
                                               grid.refresh();
                                               aps.apsc.gotoView("isitup-domains-view");
                                           });
                                        }
                                    });
                                });
                            }
                        grid.refresh();
                        }
                }],
                ["aps/ToolbarButton", {
                    label: "Stop watch for domain",
                    iconClass: "sb-delete",
                    autoBusy: false,
                    // requireItems property if set to true means that the button will be enabled for clicking only when one or several rows are selected 
                    requireItems: true,
                    onClick: function() {
                        // to operate on grid's data we need to find what was selected
                        var grid = registry.byId("grid");
                        var sel = grid.get("selectionArray");

                        for (var i=0; i<sel.length; i++){

                            // remove linked resource isitup_domain
                            console.log("store.get(sel[i]).name");
                            console.log(store.get(sel[i]).name);

                            getResourceId(store.get(sel[i]).name).then(function(resultResID){
                                isitup_domainStore.query().then(function(){
                                    if (resultResID.length > 0) { // if resource is existing then delete it:
                                        when(isitup_domainStore.remove(resultResID), function() {
                                            grid.refresh();
                                            aps.apsc.gotoView("isitup-domains-view");
                                        });

                                    }
                                });
                            });
                        }
                        grid.refresh();
                    }
                }]
            ]]]
        ]
    ]];


function findHash(hash, data) {
  var dataLen = data.length;
  for (dataLen > 0; dataLen--; ) {
    if (data[dataLen].dom_id == hash) {
      return data[dataLen].status;
    }
  }
  return false;
}

    var isitupDomIdArray = [];
    var promises = [];
    var array_idomains;

    isitup_domainStore.query().then( function(data) {
        console.log(" --- 1 --- ", data);
         return all(data.map(function(item) {
            isitupDomIdArray.push( {dom_id: item.dom_id, status: item.status} ); // array contains a list of aps.id for resources "http://shelikhov.net/isitup2/isitup_domain/2.0" 
            array_idomains = data;
            return xhr.get('/aps/2/resources/' + item.aps.id + '/getstatus');
        }));
    }).then(function(v){ 
        console.log(" --- Saved ---- ");
        console.dir(array_idomains);

        domainStore.query().then(function(poa_domains) {
            console.log(" --- 3 --- ");
            console.dir(poa_domains);
            var i=1;
            poa_domains.forEach( function(poaDomain) { // просматриваем все POA домены и выставляем Monitoring status в "yes", если есть ссылка на ресурс isitup_domain:
                        //console.dir(item);
                        console.log("======= hash search =====");
                        console.log("====== id ======", poaDomain.aps.id);
                        console.dir(array_idomains);
                        console.dir( findHash(poaDomain.aps.id, array_idomains) );
                        store.add({
                            id: i, 
                            name: poaDomain.name, 
                            monitoring: findHash(poaDomain.aps.id, array_idomains) == false ? 'no' : 'yes', 
                            status: findHash(poaDomain.aps.id, array_idomains), 
                            apsId: poaDomain.aps.id 
                        });
                i++;
            });
            load(widgets);

        });
    
    });



});