"use strict";

define(['app', '../controllers/FmContextMenuCtrl'], function (app) {

    app.directive('fmContextMenu', ['$rootScope', 'localStorageService', 
    function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmContextMenuCtrl',
            templateUrl: '/partials/fm-context-menu.html',
            link: function (scope, element, attr) {

            }
        };
    }]);

});