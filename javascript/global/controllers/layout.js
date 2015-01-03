(function () {
    'use strict';

    angular.module('jmd.global').controller('LayoutCtrl', [
        '$localStorage', '$rootScope', '$scope', '$location', '$state', 'Utilisateur', '$ionicPopup', 'Authentification',
        function ($localStorage, $rootScope, $scope, $location, $state, Utilisateur, $ionicPopup, Authentification) {
			this.logout = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Voulez-vous vraiment vous déconnecter ?',
                    buttons: [
                      { text: 'Non' },
                      { text: 'Oui',
                        type: 'button-positive',
                        onTap: function(e) {
                            Authentification.logout();
                        } }]
                });            
            };

            $scope.isLogguedIn = Utilisateur.isLogguedIn;

            $rootScope.$on('$stateChangeStart', 
                function(event, toState, toParams, fromState, fromParams) {
                    $scope.isLogguedIn = Utilisateur.isLogguedIn;

                    // Utilisateur non connecté et accès à une page autre que celle de login.
                    if (false === Utilisateur.isLogguedIn && '/login' !== toState.url) {
                        // Force une redirection vers le formulaire de login
                        event.preventDefault(); 
                        $state.go('app.login');
                    } 
                }
            );
    }]);
}());