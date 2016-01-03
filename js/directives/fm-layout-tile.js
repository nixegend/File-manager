define(['app', '../controllers/FmTileLayoutCtrl'], function (app) {

    app.directive('fmTileLayout', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        return {
            restrict: 'E',
            replace: true,
            controller: 'FmTileLayoutCtrl',
            templateUrl: '/partials/layout-tile.html',
            link: function (scope, element, attr) {

            }
        };
    }]);

});