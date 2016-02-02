define(['app', '../services/API', '../directives/fm-layout-table', '../directives/fm-layout-tile'], function (app) {
    app.controller('FmContainerCtrl', ['$scope', '$filter', 'api', 'localStorageService', '$rootScope',
        function ($scope, $filter, api, localStorageService, $rootScope) {

            $scope.menuFoldersTree = '/partials/menu-folder-tree.html';
            $scope.contextMenuState = false;
            $scope.disabledMenuItem = true;
            $scope.disabledPaste = true;
            $scope.allSelected = false;

            api.getJSONresponse('foldersTree').then(function (data) {
                $scope.foldersTree = data;
                $scope.tableData = data.content;
            });

            $scope.goToDirectory = function (data) {
                if (data.folder) {
                    $scope.breadcrumbArr = data.path.split('/').slice(2);
                    $scope.tableData = data.content;
                    if (data.storage) $scope.breadcrumbArr = [];
                }
            };

            $scope.breadcrumbWalker = function (index, last) {
                if (last) return;
                var destArr = $scope.breadcrumbArr.slice(0, index + 1);
                var tree = $scope.foldersTree;

                for (var i = 0; i < index + 1; i++) {
                    tree = $filter('filter')(tree.content, { name: destArr[i] })[0];
                    if (i == index) $scope.goToDirectory(tree);
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

            $scope.selectAll = function (data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].selected = !$scope.allSelected;
                }
                $scope.allSelected = !$scope.allSelected;
                $scope.disabledMenuItem = !$scope.allSelected;
            };

            $scope.selectThis = function (item) {
                item.selected = !item.selected;
                var arr = $filter('filter')($scope.tableData, { selected: true });
                $scope.disabledMenuItem = (arr.length <= 0) ? true : false;
                if (arr.length <= 0) $scope.allSelected = false;
                if (arr.length == $scope.tableData.length) $scope.allSelected = true;
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