require([
    "aps/ResourceStore",
    "dojox/mvc/at",
    "aps/load",
    "dojo/when",
    "dijit/registry",
    "aps/Memory",
    "dojox/mvc/getStateful",
    "./js/getDomains.js",
    "./js/displayError.js",
    "aps/ready!"]
    , function (ResourceStore, at, load, when, registry, Memory, getStateful, getDomains, displayError) {

    // creating a resource store to add the user later, target can be either the collection 'users' in organization resource
    // or just /aps/2/resources but in this case link to organization needs to be specified manually in model for new user
    var store = new ResourceStore({
        target: "/aps/2/resources/" + aps.context.vars.organization.aps.id + "/users"
    });

    // creating a modelUser object skeleton to be filled later from user selections
    var modelUser =  getStateful({
        aps: {type: "http://egordeeva.de/seatsmanager/user/1.0"},
        email: "",
        fieldone: "",
        fieldtwo: "",
        user: { aps: { id: "" } }
    });

    // getDomains() returns users that have not yet been added into Seatmanager, see js/getDomains.js for details
    when(getDomains(), function(result) {

        // by default the first returned user is pre-selected in aps/Select widget, we need to show his email and displayName
        modelUser.email = result.users[0].email;
        modelUser.user.aps.id = result.users[0].id;

        // creating a Memory to be used for aps/Select
        var selectionList = new Memory({ data: result.users });

        // creating widgets layout, data for Select and Output is taken from the first user returned by getDomains()
        var widgets =
        ["aps/PageContainer", {id: "userpage"}, [
            ["aps/FieldSet", {title: "Settings"}, [
                        ["aps/Select", {id: "userSelect", name: "user", store: selectionList, value: at(modelUser.user.aps, "id"), title: "User"}],
                        ["aps/Output", {id: "email", label: _("email"), value: at(modelUser, "email")}],
                        ["aps/TextBox", {id: "fieldone", label: _("fieldone"), value: at(modelUser, "fieldone"), required: true}],
                        ["aps/TextBox", {id: "fieldtwo", label: _("fieldtwo"), value: at(modelUser, "fieldtwo"), required: true}]
            ]]
        ]];

        load(widgets);

        // we need to update 'email' widget each time a new user is selected
        modelUser.user.aps.watch("id", function(property, old_value, value) {
            modelUser.set("email", selectionList.get(value).email);

        });

        aps.app.onCancel = function() {
            aps.apsc.gotoView("users");
         };

        aps.app.onSubmit = function() {
            // before proceeding need to check if the input is valid, e.g. all required fields have been filled
            // if true - add the user to the store, if false - cancel processing and highlight widget that did not pass validation
            var page = registry.byId("userpage");
            
            if (page.validate()) {
                when(store.put(modelUser),
                    function() {
                        aps.apsc.gotoView("users");
                    },
                    function(err) {
                        aps.apsc.cancelProcessing();
                        displayError(err);
                });
            } else {
                // informs the panel that it should cancel the current processing (e.g. reset the loading status of the Submit button)
                aps.apsc.cancelProcessing();
            }
        };
    });
}); // end of require