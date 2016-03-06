"use strict";

define(['app', '../controllers/FmHeaderCtrl'], function (app) {

    app.directive('fmHeader', ['$rootScope', 'localStorageService', 
    function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmHeaderCtrl',
            templateUrl: '/partials/fm-header.html'
        };
    }]);

});