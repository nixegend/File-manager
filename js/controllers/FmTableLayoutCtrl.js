define(['app'], function (app) {
    app.controller('FmTableLayoutCtrl', ['$scope', '$rootScope', 'localStorageService',
        function ($scope, $rootScope, localStorageService) {

            $scope.criteria = null;
            $scope.reverse = true;

            $scope.sortOrder = function (criteria) {
                $scope.reverse = ($scope.criteria === criteria) ? !$scope.reverse : false;
                $scope.criteria = criteria;
            };

        }]);
});