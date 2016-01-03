define(['app', '../controllers/FmTableLayoutCtrl'], function (app) {

    app.directive('fmTableLayout', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmTableLayoutCtrl',
            templateUrl: '/partials/layout-table.html',
            link: function (scope, element, attr) {

            }
        };
    }]);

});