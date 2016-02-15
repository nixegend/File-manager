define(['app'], function (app) {
    app.controller('FmTileLayoutCtrl', ['$scope', '$rootScope', 'localStorageService',
        function ($scope, $rootScope, localStorageService) {

            $scope.setfileClass = function (ext) {
                switch (ext) {
                    case 'txt': ''; break;
                    case '': ''; break;
                    case '': ''; break;
                    case '': ''; break;
                    case '': ''; break;
                    case '': ''; break;

                    default: 'fa-file-text-o'; break;
                }
            };


        }]);
});