(function () {
    'use strict';

    angular.module('jmd.authentification').service('Utilisateur', [
        '$localStorage', function ($localStorage) {

            var User = function () {
                this.login = '';
                this.isLogguedIn = false;
            };

            User.prototype.getLogin = function () {
                return this.login || '';
            };

            User.prototype.setLogin = function (login) {
                this.login = login;

                return this;
            }; 

            User.prototype.getIsLogguedIn = function () {
                return this.isLogguedIn || false;
            };

            User.prototype.setIsLogguedIn = function (value) {
                this.isLogguedIn = value;
            };

            return new User();
        }]);
}());