(function () {
  'use strict';

  angular.module('jmd.authentification').controller('LoginCtrl', ['$ionicPopup', 'Authentification', '$rootScope', '$scope', '$state', '$ionicLoading',
  	function($ionicPopup, Authentification, $rootScope, $scope, $state, $ionicLoading) {
  		$scope.credentials = { 
            username: '',
            password: ''
      	};

      	$scope.showErrorInputUsername = false;
      	$scope.showErrorInputPassword = false;

    	$scope.connect = function () {
	        $scope.showErrorInputUsername = false;
	        $scope.showErrorInputPassword = false;

	        if ( ($scope.credentials.username.length > 0) && 
	             ($scope.credentials.password.length > 0)) { 

	        	$scope.logins = {
	        		username: $scope.credentials.username,
	        		password: sha256_digest($scope.credentials.password)
	        	}

	        	$ionicLoading.show({
              		template: 'Chargement...'
            	});

	        	Authentification.login($scope.logins, function() {
	        		$ionicLoading.hide();
	        	});
	        } else {
	            if ($scope.credentials.username.length == 0) { 
	               $scope.showErrorInputUsername = true;
	            }

	            if ($scope.credentials.password.length == 0) { 
	               $scope.showErrorInputPassword = true;
	            }

	            var popupError = $ionicPopup.confirm({
	                title: '<b>Erreur</b>',
	                template: 'Pseudo / mot de passe vide.',
	                buttons: [
	                { text: 'OK',
	                    type: 'button-positive'
	                }]
	            });     
	        }
    	};
  	}]);
}());