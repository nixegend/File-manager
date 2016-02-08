define(['app'], function (app) {
    app.controller('FmTileLayoutCtrl', ['$scope', '$rootScope', 'localStorageService',
        function ($scope, $rootScope, localStorageService) {

        }]);

    app.filter('rows', function () {
        return function (arr) {
            var num = Math.ceil(arr),
                arrRows = [];
            for (var i = 0; i < num; i++) {
                arrRows[i] = i;
            }
            return arrRows;
        };
    });
});