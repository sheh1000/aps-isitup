require([
    "aps/ResourceStore",
    "dojo/when",
    "dojo/_base/array",
    "aps/Memory",
    "aps/xhr",
    "dijit/registry",
    "aps/load",
    "./js/displayError.js",
    "./js/getDomains.js",
    "aps/ready!"],
function (ResourceStore, when, array, Memory, xhr, registry, load, displayError, getDomains) {

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
    
    // получаем массив ссылок на домен. item.name содержит aps.id домена в POA
    
    var isitupDomIdArray = [];
    isitup_domainStore.query().then(function(data) {
        console.log('===== isitupDomIdArray ====');
        console.dir(data);
        isitupDomIdArray=data;
    });


    memory = new Memory();

/*    isitup_domainStore.query().then(function(data) {
        // data - то, что внутри.
        console.log('===== query result ====');
        console.dir(data);

        array.forEach(data, function(item) {
            console.log("==== item ====");
            console.dir(item);
            //memory.add({id: item.id, my_field: Math.random()});
            console.log("==== aps.id ====");
            console.dir(item.aps.id);

            when(xhr("/aps/2/resources/" + item.aps.id + "/apsdomain", {method: "GET",  handleAs: "json"}),
                function(getresult){
                    console.log("==== getresult ====");
                    console.log(getresult);
                    if (getresult.length > 0) {
                        console.log("есть связь c " + getresult[0].name);
                        memory.add({id: item.aps.id, domain: item.name, });
                    }
                    else {
                        console.log("связи нет");
                    }
                    
                },
                function(err) {displayError(err);}
            );
        });
    });
*/
      var storeArray = [
        {name: "one", prime: false },
        {name: "two", even: true, prime: true},
        {name: "three", prime: true},
        {name: "four", even: true, prime: false},
        {name: "five", prime: true}
      ];

    var store = new Memory({
        data: storeArray,
        idProperty: "name"
        });
    


    console.log("SASDASDADS");
    console.dir(store);

    console.log("Array for each");
    array.forEach(store.query(), function(item) {
        console.log(item);
    });

    console.log("idProperty");
    console.dir(store.idProperty);

        console.log("store(Memory)");
        console.dir(store);
 

   var widgets =
    ["aps/PageContainer", [
        ["aps/Grid", {
            id: "grid",
            columns: [
                {name: "name", field: "name"},
                {name: "prime", field: "prime"}],
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
                            // need to check if the user can be created, if not - no need to redirect to user-add view
                            when(getDomains(), function(result) {
                                console.log("======================");
                                console.log(result);
//                                if (!result.users.length) {
  //                                  displayError(result.message);
    //                                return;
      //                          }
                                aps.apsc.gotoView("domain-add");
                            });
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
                            when(domainStore.remove(sel[i]), function() {
                                grid.refresh();
                            }
                        );
                        }
                    }
                }]
            ]]]
        ]
    ]];


    domainStore.query().then(function(data) {
        console.dir(data); 
        var i=6;
        array.forEach(data, function(item) {
            //store.add({id: i, name: item.name, status: isitupDomIdArray.indexOf(item.aps.id) == -1 ? 'no' : 'yes' });
            console.log("here is domain name");
            console.log(item.name);
            store.put({id: i, name: item.name, prime: false});
            i++;
        });

        load(widgets);
    });

registry.byId("grid").refresh();

});