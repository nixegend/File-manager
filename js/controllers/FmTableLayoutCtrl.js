define(['app'], function (app) {
    app.controller('FmTableLayoutCtrl', ['$scope', '$rootScope', 'localStorageService',
        function ($scope, $rootScope, localStorageService) {

            $scope.getDocSize = function (fSize) {
                var arr = [], k = 0;
                function getSize(s) {
                    if (k == 3) {
                        arr.push((s % 10) + ',');
                        k = 0;
                    } else {
                        arr.push(s % 10);
                    }
                    s = parseInt(s / 10);
                    k++;
                    return s ? getSize(s) : arr.reverse().join('');
                }
                return getSize(Math.ceil(fSize / 1024));
            };

            $scope.criteria = null;
            $scope.reverse = true;

            $scope.sortOrder = function (criteria) {
                $scope.reverse = ($scope.criteria === criteria) ? !$scope.reverse : false;
                $scope.criteria = criteria;
            };

        }]);
});