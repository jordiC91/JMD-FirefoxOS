(function () {
    'use strict';

    var appMdl = angular.module('jmd', [
		'ionic', 
        /* Modules AngularJS. */
        'ngResource',
        'ngStorage',
        'ngCookies',
        /* Modules jmd. */
        'jmd.admin',
		'jmd.authentification',
		'jmd.global'
    ]);

    appMdl.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'partials/menu.html'
            })
			.state('app.adminAccueil', {
                url: '/admin-accueil',
                views: {
                    'menuContent': {
                        templateUrl: 'partials/admin/accueil.html',
                        controller: 'AccueilAdminCtrl'
                    }
                }
            })
			.state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'partials/login.html',
                        controller: 'LoginCtrl'
                    }
                }
            });
        
        $urlRouterProvider.otherwise('/app/admin-accueil');
    }]);

    appMdl.factory('JMDHttpInterceptor', [
        '$q', 'Utilisateur', '$injector', '$localStorage', 
        function($q, Utilisateur, $injector, $localStorage) {
            return {
                response: function (response) {
                    return response || $q.when(response);
                },

                responseError: function (rejection) {
                    var state;
                    
                    // cas du 401 -> redirection à la page de login
                    if (rejection.status === 401) {
                        state = $injector.get('$state');

                        Utilisateur.setIsLogguedIn(false);

                        state.go('app.login');
                    }

                    return $q.reject(rejection);
                }
            }
    }]);

    appMdl.config(['$httpProvider',
        function ($httpProvider) {
            $httpProvider.interceptors.push('JMDHttpInterceptor');
        }
    ]);

    appMdl.run(['$localStorage', 'Authentification', function ($localStorage, Authentification) {
        if (angular.isDefined($localStorage.utilJMD)) {
            Authentification.initUtilisateur($localStorage.utilJMD.username);
        }
    }]); 
}());
