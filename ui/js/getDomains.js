/* this module returns set difference between two collections - POA domains
and collection of seatsmanager/user resources available with the token of this user
join: core/service-user.login = seatsmanager/user.email */

define(["aps/ResourceStore", "dojo/Deferred", "dojo/when"],
        function (ResourceStore, Deferred, when) {
                var getDomains = function () {
                        var no_free_domains="You don't have a user that can be added into SeatsManager.";
                        var no_domains=_("You don't have domains in your account.");

                        // we need to get both collections to compare later
                        var domainStore = new ResourceStore({
                                apsType: "http://parallels.com/aps/types/pa/dns/zone/1.0",
                                target: "/aps/2/resources/"
                        });

                        var isitup_domainStore = new ResourceStore({
                                apsType: "http://shelikhov.net/isitup2/isitup_domain/2.0",
                                target: "/aps/2/resources/"
                        });

                        console.log('===== isitup_domainStore ====');
                        console.dir(isitup_domainStore);

                        var deferred = new Deferred();

                        when(domainStore.query(), function(domains) {
                                // we need to check if there are any domains available for linking
                                if ( ! domains.length ) {
                                        deferred.resolve({domains:[], message: no_domains});
                                        return (deferred);
                                }
                                when(isitup_domainStore.query(), function(isitupDomains) {
                                        var isitupDomainHash = {};
                                        var domainList = [];

                                        for (var i = 0; i < isitupDomains.length; i++) {
                                                var isitupDomain = isitupDomains[i];
                                                isitupDomainHash[isitupDomain.email] = true;
                                        }
    
                                        for (var j = 0; j < domains.length; j++) {
                                                var domain = domains[j];
                                                // if the user with such email is found in both collections we do not need to add him to resulting domainList
                                                if (isitupDomainHash[domain.login]) {
                                                        continue;
                                                        
                                                }
                                                domainList.push({ id: domain.aps.id, label: domain.displayName, email: domain.login, value: domain.aps.id });
                                        }

                                        // if there is no difference between the sets it means that all domains were added into application
                                        if (! domainList.length) {
                                                deferred.resolve({domains:[], message: no_free_domains});
                                                return (deferred);
                                        }
                                        domainList.sort(function(a, b) {return a.label <= b.label;});
                                        deferred.resolve({domains:domainList, message: ""});
                                        return (deferred);
                                });
                        });
                        return (deferred);
                };
                
                return getDomains;
        }
);