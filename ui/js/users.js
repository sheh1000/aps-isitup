require([
    "aps/ResourceStore",
    "dojo/when",
    "dojo/Deferred",
    "dojo/promise/all",
    "dojo/_base/array",
    "dojo/request/xhr",
    "aps/Memory",
    "aps/xhr",
    "dijit/registry",
    "aps/load",
    "./js/displayError.js",
    "./js/getDomains.js",
    "aps/ready!"],
function (ResourceStore, when, Deferred, all, array, dojoxhr, Memory, xhr, registry, load, displayError, getDomains) {


    function isitup_requets(domainName) {
        return new Promise(function(resolve, reject) {
        when(dojoxhr("https://endpoint.only.dshelikhov.apsdemo.org/isitup22/parse.php?domain=" + 
                                domainName, { method: "GET", handleAs: "json"}), 
            function(getresult){   
            },
            function(err) {displayError(err);}
        );
        });
    };

    var testString = "google.com";
    isitup_requets(testString).then(function(response) {
        // do something
        console.log(response);
    }, function(Error) {
        console.log(Error);
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

    // получаем массив ссылок на домен. item.name содержит aps.id домена в POA
    // isitupDomIdArray - массив aps.id для ресурсов типа "http://shelikhov.net/isitup2/isitup_domain/2.0"
    var isitupDomIdArray = [];
    isitup_domainStore.query().then(function(data) {
        array.forEach(data, function(item) {
            isitupDomIdArray.push(item.name)
        });
    });


/* function testRenderCell("example.com"){
   // Not sure what 'options' refers to; I didn't need a fourth param
 (function(d, s) {
    // Start a new script tag, get position to insert.
    var t = d.createElement(s),
        e = d.getElementsByTagName(s)[0];

    // Set the attributes of the script tag.
    t.src  = "https://isitup.org/widget/widget.js";

    // Insert the script tag.
    e.parentNode.insertBefore(t, e);
}(document, "script"));
 return "asdffa";
    }
*/

   var widgets =
    ["aps/PageContainer", [
        ["aps/Grid", {
            id: "grid",
            columns: [
                {name: "POA domain", field: "name"},
                {name: "Monitoring", field: "status"},
                {name: "Test", field: "status"}
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
                            // need to check if the user can be created, if not - no need to redirect to user-add view
                            when(getDomains(), function(result) {
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


    // просматриваем все POA домены и выставляем Monitoring status в "yes", если есть ссылка на ресурс isitup_domain
    domainStore.query().then(function(data) {
        var i=1;
        array.forEach(data, function(item) {
                     store.add({id: i, name: item.name, status: isitupDomIdArray.indexOf(item.aps.id) == -1 ? 'no' : 'yes' });
            i++;
        });

        load(widgets);
    });



});