define(['app', '../services/API', '../directives/fm-layout-table', '../directives/fm-layout-tile'], function (app) {
    app.controller('FmContainerCtrl', ['$scope', 'api', 'localStorageService', '$rootScope',
        function ($scope, api, localStorageService, $rootScope) {

            $scope.menuFoldersTree = '/partials/menu-folder-tree.html';
            $scope.contextMenuState = false;

            api.getJSONresponse('foldersTree').then(function (data) {
                $scope.foldersTree = data;
                $scope.tableData = data.content;
                $scope.breadcrumbArr = [];
            });

            $scope.goToDirectory = function (data) {
                if (data.folder) {
                    console.log(data);
                    $scope.breadcrumbArr.push(data.name);
                    $scope.tableData = data.content;
                    if (data.storage) $scope.breadcrumbArr = [];
                }
            };

            $scope.toggleLevelBelow = function (obj) {
                obj.open = !obj.open;
            };

            $scope.contextMenuBtn = function () {
                $scope.contextMenuState = !$scope.contextMenuState;
            };

            $scope.renderFileName = function (fName, ext) {
                if (ext && $rootScope.fmSettings.showExt) {
                    return (fName != '.') ? fName + '.' + ext : '.' + ext;
                } else {
                    return fName;
                }
            };

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

        }]);
});