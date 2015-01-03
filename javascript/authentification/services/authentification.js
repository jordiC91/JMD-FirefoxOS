(function () {
    'use strict';

    angular.module('jmd.authentification').factory('Authentification', [
        '$cookieStore', '$resource', '$location', '$window', '$rootScope', 'Utilisateur', '$localStorage', '$timeout', '$state',
        function ($cookieStore, $resource, $location, $window, $rootScope, Utilisateur, $localStorage, $timeout, $state) {
            var apiPath = webservicesURL + 'admin/login';

            var resource = $resource(apiPath, {}, {
                login: {
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            });

            return {
                AUTH_SUCCESS: 'SUCESS',
                AUTH_FAILED: 'FAILED',

                login: function (credentials, successFn) {
                    var self = this;

                    resource.login(jQuery.param(credentials), function () {
                        self.initUtilisateur(credentials.username);
                        
                        $localStorage.utilJMD = {
                            username: credentials.username
                        };

                        if (angular.isDefined(successFn)) {
                            successFn();
                        }

                        $state.go('app.adminAccueil');
                    }, function (httpResponse) {
                        if (httpResponse.status === 401) {
                           console.log(httpResponse);
                        }
                    });
                },

                logout: function () {
                    $localStorage.$reset();
                    
                    Utilisateur.setIsLogguedIn(false);

                    $state.go('app.login');
                },

                initUtilisateur: function (username) {
                    Utilisateur.setLogin(username);
                    Utilisateur.setIsLogguedIn(true);
                }
            };
        }]);
}());